import { Component, computed, inject, signal } from '@angular/core';

import { AlerteService } from '../../core/services/alerte.service';
import { ZoneService } from '../../core/services/zone.service';
import { Alerte, ZoneARisque } from '../../core/models';
import { Navbar } from '../../shared/components/navbar/navbar';
import { AlerteCard } from '../../shared/components/alerte-card/alerte-card';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Icon } from '../../shared/components/icon/icon';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';

// Ecran 6 - Historique par quartier (Frontend Specifications v3, section 4). Carte-resume +
// liste alignees sur la maquette Stitch historique_des_alertes.
@Component({
  selector: 'app-historique',
  imports: [Navbar, AlerteCard, EmptyState, Skeleton, TopAppBar, Icon],
  templateUrl: './historique.html',
  styleUrl: './historique.css',
})
export class Historique {
  private readonly alerteService = inject(AlerteService);
  private readonly zoneService = inject(ZoneService);

  zones = signal<ZoneARisque[]>([]);
  quartierSelectionne = signal<string | null>(null);
  alertesPassees = signal<Alerte[]>([]);
  chargement = signal(true);

  scoreMoyen = computed(() => {
    const alertes = this.alertesPassees();
    if (alertes.length === 0) {
      return 0;
    }
    return Math.round(alertes.reduce((somme, a) => somme + a.score, 0) / alertes.length);
  });

  couleurScoreMoyen = computed(() => {
    const score = this.scoreMoyen();
    if (score >= 85) return 'text-danger';
    if (score >= 60) return 'text-warning';
    if (score >= 30) return 'text-caution';
    return 'text-white';
  });

  constructor() {
    this.zoneService.getZonesARisque().subscribe((zones) => {
      this.zones.set(zones);
      if (zones.length > 0) {
        this.selectionnerQuartier(zones[0].nom_quartier);
      }
    });
  }

  selectionnerQuartier(nomQuartier: string) {
    this.quartierSelectionne.set(nomQuartier);
    this.chargement.set(true);
    this.alerteService.getHistorique(nomQuartier).subscribe((alertes) => {
      this.alertesPassees.set(alertes);
      this.chargement.set(false);
    });
  }
}
