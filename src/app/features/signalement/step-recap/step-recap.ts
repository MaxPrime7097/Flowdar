import { Component, computed, input, output } from '@angular/core';

import { NiveauAlerte, ZoneARisque } from '../../../core/models';
import { BadgeNiveau } from '../../../shared/components/badge-niveau/badge-niveau';
import { Icon } from '../../../shared/components/icon/icon';

// Etape 3 : recapitulatif + envoi (Frontend Specifications v3, section 4)
@Component({
  selector: 'app-step-recap',
  imports: [BadgeNiveau, Icon],
  templateUrl: './step-recap.html',
  styleUrl: './step-recap.css',
})
export class StepRecap {
  modeZone = input.required<'connue' | 'inconnue'>();
  zoneId = input<string | null>(null);
  niveau = input.required<NiveauAlerte>();
  description = input.required<string>();
  zones = input.required<ZoneARisque[]>();
  envoiEnCours = input(false);
  envoye = input(false);
  enFileAttente = input(false);

  envoyer = output<void>();
  retourCarte = output<void>();

  nomQuartier = computed(
    () => this.zones().find((z) => z.id === this.zoneId())?.nom_quartier ?? 'Zone non repertoriee (GPS)',
  );

  couleurAvatar = computed(() => {
    switch (this.niveau()) {
      case 'leger':
        return 'bg-caution';
      case 'moyen':
        return 'bg-warning';
      case 'dangereux':
        return 'bg-danger';
    }
  });
}
