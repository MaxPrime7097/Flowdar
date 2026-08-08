import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { AlerteService } from '../../core/services/alerte.service';
import { AuthService } from '../../core/services/auth.service';
import { MapsService } from '../../core/services/maps.service';
import { ZoneService } from '../../core/services/zone.service';
import { Alerte, Confirmation, LABEL_SOURCE_ALERTE } from '../../core/models';
import { BadgeStatut, EtatBadgeStatut } from '../../shared/components/badge-statut/badge-statut';
import { Icon } from '../../shared/components/icon/icon';
import { ScoreBadge } from '../../shared/components/score-badge/score-badge';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { SosSheet } from '../../shared/components/sos-sheet/sos-sheet';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';
import { Toast } from '../../shared/components/toast/toast';
import { TempsEcoulePipe } from '../../shared/pipes/temps-ecoule.pipe';
import { ConfirmationList } from './confirmation-list/confirmation-list';
import { ScoreBreakdown } from './score-breakdown/score-breakdown';

// Ecran 2 - Detail d'une alerte (Frontend Specifications v3, section 4 ; mini-carte,
// analyse du risque et bouton SOS ajoutes pour matcher d_tail_de_l_alerte_ndokotti)
@Component({
  selector: 'app-alerte-detail',
  imports: [
    ScoreBadge,
    ScoreBreakdown,
    ConfirmationList,
    TempsEcoulePipe,
    Skeleton,
    Toast,
    TopAppBar,
    Icon,
    SosSheet,
    BadgeStatut,
  ],
  templateUrl: './alerte-detail.html',
  styleUrl: './alerte-detail.css',
})
export class AlerteDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alerteService = inject(AlerteService);
  private readonly zoneService = inject(ZoneService);
  private readonly authService = inject(AuthService);
  private readonly mapsService = inject(MapsService);

  private readonly miniMapContainer = viewChild<ElementRef<HTMLElement>>('miniMapContainer');
  private miniCarteInitialisee = false;

  alerte = signal<Alerte | undefined>(undefined);
  chargement = signal(true);
  confirmations = signal<Confirmation[]>([]);
  messageToast = signal<string | null>(null);
  sosOuvert = signal(false);

  labelSource = computed(() => (this.alerte() ? LABEL_SOURCE_ALERTE[this.alerte()!.source] : ''));

  // Badge type PREVENTIVE (bleu) / ACTIVE (rouge) - Frontend Specifications v3, Ecran 2 et
  // checklist section 9 item 10. Une alerte preventive prime sur son statut : la spec interdit
  // la combinaison PREVENTIVE + DANGEREUX, le type est donc l'information la plus structurante.
  etatBadge = computed<EtatBadgeStatut | null>(() => {
    const alerte = this.alerte();
    if (!alerte) {
      return null;
    }
    return alerte.type === 'preventive' ? 'preventif' : alerte.statut;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;

    combineLatest([this.alerteService.getAlerteById(id), this.zoneService.getZonesARisque()]).subscribe(
      ([alerte, zones]) => {
        if (!alerte) {
          this.alerte.set(undefined);
          return;
        }
        const zone = zones.find((z) => z.id === alerte.zone_id);
        this.alerte.set({
          ...alerte,
          nom_quartier: alerte.nom_quartier ?? zone?.nom_quartier,
          lat: alerte.lat ?? zone?.lat,
          lng: alerte.lng ?? zone?.lng,
        });
        this.chargement.set(false);
      },
    );

    this.alerteService.getConfirmations(id).subscribe((confirmations) => this.confirmations.set(confirmations));

    effect(() => {
      const alerte = this.alerte();
      const container = this.miniMapContainer();
      if (!alerte || !container || this.miniCarteInitialisee || alerte.lat === undefined || alerte.lng === undefined) {
        return;
      }
      this.miniCarteInitialisee = true;
      this.mapsService
        .initialiserCarte(container.nativeElement, { lat: alerte.lat, lng: alerte.lng })
        .then((map) => {
          map.setZoom(14);
          this.mapsService.ajouterMarqueur(alerte);
        });
    });
  }

  confirmer() {
    if (!this.authService.estConnecte()) {
      this.router.navigateByUrl('/auth');
      return;
    }
    const alerte = this.alerte();
    if (!alerte) {
      return;
    }
    this.alerteService.confirmerAlerte(alerte.id).subscribe(({ nb_confirmations }) => {
      this.alerte.set({ ...alerte, nb_confirmations });
      this.messageToast.set('Confirmation enregistree, merci !');
    });
  }

  cestPasse() {
    if (!this.authService.estConnecte()) {
      this.router.navigateByUrl('/auth');
      return;
    }
    const alerte = this.alerte();
    if (!alerte) {
      return;
    }
    this.alerteService.resoudreAlerte(alerte.id).subscribe(() => {
      this.alerte.set({ ...alerte, statut: 'resolu' });
      this.messageToast.set('Merci, alerte marquee comme resolue.');
    });
  }
}
