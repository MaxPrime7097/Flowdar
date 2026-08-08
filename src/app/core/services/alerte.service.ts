import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { firestore } from '../firebase';
import { MOCK_ALERTES, MOCK_CONFIRMATIONS } from '../mock-data';
import { Alerte, Confirmation, Signalement } from '../models';
import { OfflineQueueService } from './offline-queue.service';

export interface ResultatSignalement {
  alerte: Alerte;
  enFileAttente: boolean;
}

function retirerPhoto(signalement: Signalement): Signalement {
  const copie = { ...signalement };
  delete copie.photo_url;
  return copie;
}

function construireAlertePlaceholder(signalement: Signalement, prefixeId: string): Alerte {
  const id = `${prefixeId}-${Date.now()}`;
  return {
    id,
    type: 'active',
    source: 'citoyen',
    zone_id: 'zone_id' in signalement ? signalement.zone_id : 'zone-inconnue',
    score: 0,
    niveau: signalement.niveau,
    heure_debut: new Date().toISOString(),
    heure_prevue: null,
    nb_confirmations: 0,
    statut: 'en_resolution',
    photo_url: signalement.photo_url ?? null,
    firestore_id: id,
  };
}

@Injectable({ providedIn: 'root' })
export class AlerteService {
  private readonly http = inject(HttpClient);
  private readonly offlineQueue = inject(OfflineQueueService);

  constructor() {
    // Rejoue la file d'attente des signalements hors ligne des que le reseau revient
    // (Frontend Specifications v3, section 8 - "Retour en ligne").
    window.addEventListener('online', () => this.synchroniserFileAttente());
  }

  // Firestore onSnapshot - flux temps reel des alertes actives (CDC v3, section 9 / 11)
  getAlertesActives(): Observable<Alerte[]> {
    if (environment.useMockData) {
      return of(MOCK_ALERTES.filter((a) => a.statut === 'actif'));
    }
    return new Observable<Alerte[]>((subscriber) => {
      const alertesQuery = query(collection(firestore, 'alertes'), where('statut', '==', 'actif'));
      const unsubscribe = onSnapshot(
        alertesQuery,
        (snapshot) => subscriber.next(snapshot.docs.map((doc) => doc.data() as Alerte)),
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  // GET /api/alertes/:id - alerte complete avec score_detail (Backend Specifications v3, section 4)
  getAlerteById(id: string): Observable<Alerte | undefined> {
    if (environment.useMockData) {
      return of(MOCK_ALERTES.find((a) => a.id === id));
    }
    return this.http.get<Alerte>(`${environment.backendUrl}/api/alertes/${id}`);
  }

  // GET /api/alertes?type=preventive
  getAlertesPreventives(): Observable<Alerte[]> {
    if (environment.useMockData) {
      return of(MOCK_ALERTES.filter((a) => a.type === 'preventive'));
    }
    return this.http.get<Alerte[]>(`${environment.backendUrl}/api/alertes`, {
      params: { type: 'preventive' },
    });
  }

  // GET /api/alertes/historique/:quartier
  getHistorique(quartier: string): Observable<Alerte[]> {
    if (environment.useMockData) {
      return of(MOCK_ALERTES.filter((a) => a.nom_quartier === quartier));
    }
    return this.http.get<Alerte[]>(`${environment.backendUrl}/api/alertes/historique/${quartier}`);
  }

  getConfirmations(alerteId: string): Observable<Confirmation[]> {
    if (environment.useMockData) {
      return of(MOCK_CONFIRMATIONS.filter((c) => c.alerte_id === alerteId));
    }
    return this.http.get<Confirmation[]>(`${environment.backendUrl}/api/alertes/${alerteId}/confirmations`);
  }

  // POST /api/alertes/:id/confirmer
  confirmerAlerte(id: string): Observable<{ nb_confirmations: number }> {
    if (environment.useMockData) {
      return of({ nb_confirmations: (MOCK_ALERTES.find((a) => a.id === id)?.nb_confirmations ?? 0) + 1 });
    }
    return this.http.post<{ nb_confirmations: number }>(
      `${environment.backendUrl}/api/alertes/${id}/confirmer`,
      {},
    );
  }

  // POST /api/alertes/:id/resoudre
  resoudreAlerte(id: string): Observable<{ statut: string }> {
    if (environment.useMockData) {
      return of({ statut: 'resolu' });
    }
    return this.http.post<{ statut: string }>(`${environment.backendUrl}/api/alertes/${id}/resoudre`, {});
  }

  // POST /api/alertes/signaler - zone connue (zone_id) OU inconnue (lat/lng GPS citoyen).
  // Sans reseau (ou si la requete echoue en cours de route), le signalement est mis en file
  // d'attente localStorage et rejoue automatiquement a la reconnexion (section 8 du cahier
  // des charges). La photo n'est pas conservee dans la file : elle necessite un upload
  // Firebase Storage, impossible hors ligne.
  signalerZone(signalement: Signalement): Observable<ResultatSignalement> {
    if (environment.useMockData) {
      return of({ alerte: construireAlertePlaceholder(signalement, 'alerte-mock'), enFileAttente: false });
    }

    if (!navigator.onLine) {
      this.offlineQueue.ajouter(retirerPhoto(signalement));
      return of({ alerte: construireAlertePlaceholder(signalement, 'signalement-attente'), enFileAttente: true });
    }

    return this.http.post<Alerte>(`${environment.backendUrl}/api/alertes/signaler`, signalement).pipe(
      map((alerte) => ({ alerte, enFileAttente: false })),
      catchError(() => {
        this.offlineQueue.ajouter(retirerPhoto(signalement));
        return of({ alerte: construireAlertePlaceholder(signalement, 'signalement-attente'), enFileAttente: true });
      }),
    );
  }

  // Rejoue les signalements en attente aupres du backend (appele au retour en ligne).
  synchroniserFileAttente() {
    if (environment.useMockData) {
      return;
    }
    for (const signalement of this.offlineQueue.enAttente()) {
      this.http.post<Alerte>(`${environment.backendUrl}/api/alertes/signaler`, signalement).subscribe({
        next: () => this.offlineQueue.retirer(signalement),
        error: () => {
          // Reste en file, sera retente au prochain evenement 'online'.
        },
      });
    }
  }
}
