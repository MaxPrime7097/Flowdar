import { Injectable, inject, signal } from '@angular/core';
import { doc, setDoc } from 'firebase/firestore';
// Import de TYPE uniquement : le module firebase/messaging (~100 ko) est charge
// dynamiquement plus bas, pour ne pas peser sur le bundle initial de tous les
// utilisateurs alors que seuls ceux qui activent les notifications en ont besoin.
import type { Messaging } from 'firebase/messaging';

import { environment } from '../../../environments/environment';
import { firebaseApp, firestore } from '../firebase';
import { AuthService } from './auth.service';

export interface NotificationRecue {
  id: string;
  titre: string;
  corps: string;
  recueLe: string; // ISO
  lue: boolean;
}

export type EtatPermission = 'indisponible' | 'a-demander' | 'accordee' | 'refusee';

const CLE_HISTORIQUE = 'flowdar_notifications';

function lireHistorique(): NotificationRecue[] {
  try {
    const brut = localStorage.getItem(CLE_HISTORIQUE);
    return brut ? (JSON.parse(brut) as NotificationRecue[]) : [];
  } catch {
    return [];
  }
}

// Notifications push via Firebase Cloud Messaging (Frontend Specifications v3 : non specifie,
// ajoute cote Angular). Repartition des roles :
//   - Angular  : demande la permission, obtient le token FCM, le stocke sur le profil, affiche
//                les messages recus au premier plan.
//   - Backend  : declenche l'envoi des notifications vers ces tokens (voir SETUP.md).
//   - firebase-messaging-sw.js : affiche les notifications quand l'app est fermee.
@Injectable({ providedIn: 'root' })
export class PushService {
  private readonly authService = inject(AuthService);
  private messaging: Messaging | null = null;

  etatPermission = signal<EtatPermission>('a-demander');
  notifications = signal<NotificationRecue[]>(lireHistorique());
  nonLues = signal(lireHistorique().filter((n) => !n.lue).length);

  // A appeler au demarrage : determine si le push est utilisable et se remet a l'ecoute si
  // la permission a deja ete accordee lors d'une session precedente.
  async initialiser() {
    if (!(await this.pushDisponible())) {
      this.etatPermission.set('indisponible');
      return;
    }

    if (Notification.permission === 'denied') {
      this.etatPermission.set('refusee');
      return;
    }

    if (Notification.permission === 'granted') {
      this.etatPermission.set('accordee');
      await this.enregistrerToken();
      return;
    }

    this.etatPermission.set('a-demander');
  }

  // Declenche par l'utilisateur (bouton "Activer les notifications") : les navigateurs
  // refusent la demande de permission si elle ne suit pas une interaction explicite.
  async activer(): Promise<boolean> {
    if (!(await this.pushDisponible())) {
      this.etatPermission.set('indisponible');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      this.etatPermission.set(permission === 'denied' ? 'refusee' : 'a-demander');
      return false;
    }

    this.etatPermission.set('accordee');
    return this.enregistrerToken();
  }

  // Verification bon marche d'abord (APIs du navigateur), puis isSupported() de Firebase.
  // Evite de telecharger firebase/messaging sur un navigateur qui ne sait de toute facon
  // pas afficher de notification.
  private async pushDisponible(): Promise<boolean> {
    if (typeof Notification === 'undefined' || !('serviceWorker' in navigator)) {
      return false;
    }
    const { isSupported } = await import('firebase/messaging');
    return isSupported();
  }

  private async enregistrerToken(): Promise<boolean> {
    try {
      // La config est passee au service worker en parametres d'URL : il ne peut pas lire
      // environment.ts depuis son contexte isole.
      const parametres = new URLSearchParams(
        environment.firebaseConfig as unknown as Record<string, string>,
      );
      const registration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?${parametres.toString()}`,
      );

      const { getMessaging, getToken } = await import('firebase/messaging');
      this.messaging ??= getMessaging(firebaseApp);
      const token = await getToken(this.messaging, {
        vapidKey: environment.firebaseVapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        return false;
      }

      await this.sauvegarderToken(token);
      await this.ecouterPremierPlan();
      return true;
    } catch {
      // Cle VAPID absente ou invalide, service worker injoignable, navigateur non compatible :
      // l'app continue de fonctionner normalement, sans push.
      return false;
    }
  }

  // Le backend a besoin du token pour cibler cet appareil. On le range sur le profil
  // utilisateur ; un compte peut avoir plusieurs appareils, d'ou un dictionnaire par token.
  private async sauvegarderToken(token: string) {
    const utilisateur = await this.authService.getUidActuel();
    if (!utilisateur) {
      return;
    }
    await setDoc(
      doc(firestore, 'utilisateurs', utilisateur),
      { fcm_tokens: { [token]: new Date().toISOString() } },
      { merge: true },
    );
  }

  private async ecouterPremierPlan() {
    if (!this.messaging) {
      return;
    }
    const { onMessage } = await import('firebase/messaging');
    // Message recu alors que l'app est ouverte : le service worker ne s'en occupe pas,
    // on l'ajoute nous-memes a l'historique local.
    onMessage(this.messaging, (payload) => {
      this.ajouterNotification({
        id: `${Date.now()}`,
        titre: payload.notification?.title ?? 'Alerte Flowdar',
        corps: payload.notification?.body ?? '',
        recueLe: new Date().toISOString(),
        lue: false,
      });
    });
  }

  private ajouterNotification(notification: NotificationRecue) {
    // On garde les 50 dernieres : l'historique sert de rappel, pas d'archive.
    const historique = [notification, ...this.notifications()].slice(0, 50);
    this.ecrire(historique);
  }

  marquerToutesLues() {
    this.ecrire(this.notifications().map((n) => ({ ...n, lue: true })));
  }

  viderHistorique() {
    this.ecrire([]);
  }

  private ecrire(historique: NotificationRecue[]) {
    localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique));
    this.notifications.set(historique);
    this.nonLues.set(historique.filter((n) => !n.lue).length);
  }
}
