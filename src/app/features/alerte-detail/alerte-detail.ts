import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { AlerteService } from '../../core/services/alerte.service';
import { AuthService } from '../../core/services/auth.service';
import { MapsService } from '../../core/services/maps.service';
import { ZoneService } from '../../core/services/zone.service';
import { Alerte, Confirmation, LABEL_SOURCE_ALERTE } from '../../core/models';
import { BadgeStatut, EtatBadgeStatut } from '../../shared/components/badge-statut/badge-statut';
import { CitizenCount } from '../../shared/components/citizen-count/citizen-count';
import { Icon } from '../../shared/components/icon/icon';
import { ResolutionTracker } from '../../shared/components/resolution-tracker/resolution-tracker';
import { RiskGauge } from '../../shared/components/risk-gauge/risk-gauge';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { SosSheet } from '../../shared/components/sos-sheet/sos-sheet';
import { SourceBadge } from '../../shared/components/source-badge/source-badge';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';
import { Toast } from '../../shared/components/toast/toast';
import { TempsEcoulePipe } from '../../shared/pipes/temps-ecoule.pipe';
import { ConfirmationList } from './confirmation-list/confirmation-list';
import { ScoreBreakdown } from './score-breakdown/score-breakdown';

// Ecran 2 - Detail d'une alerte v4 - 4 blocs distincts (source, statut, risque, citoyens)
// (Frontend Specifications v4, section 5)
@Component({
  selector: 'app-alerte-detail',
  imports: [
    ScoreBreakdown,
    ConfirmationList,
    TempsEcoulePipe,
    Skeleton,
    Toast,
    TopAppBar,
    Icon,
    SosSheet,
    BadgeStatut,
    SourceBadge,
    RiskGauge,
    CitizenCount,
    ResolutionTracker,
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
    if (alerte.type === 'preventive') {
      return 'preventif';
    }
    // Map v3 statut vers v4 etat : actif | resolu | en_resolution -> actif | resolue | en_resolution
    if (alerte.statut === 'resolu') {
      return 'resolue';
    }
    return alerte.statut;
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
      this.messageToast.set('Confirmation enregistrée, merci !');
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
    // v4 - Signaler resolution declenche en_resolution (pas resolu immediatement)
    // Le backend gere la validation croisee: 3 confirmations = resolution
    this.alerteService.signalerResolution(alerte.id).subscribe(({ nb_resolutions }) => {
      this.alerte.set({ ...alerte, statut: 'en_resolution', nb_resolutions: nb_resolutions ?? 1 });
      this.messageToast.set('Thankyou for reporting, waiting for confirmation from other citizens.');
    });
  }
}
