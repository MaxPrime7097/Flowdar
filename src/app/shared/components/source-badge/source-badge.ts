import { Component, computed, input } from '@angular/core';

import { SourceAlerte } from '../../../core/models';
import { Icon, NomIcone } from '../icon/icon';

// Badge source v4 - Distingue source auto (Satellite/bleu) vs citoyen (Personne/violet)
// (Frontend Specifications v4, section 2.1)
const BADGE_SOURCE: Record<SourceAlerte, { icone: NomIcone; label: string; couleur: string }> = {
  auto: {
    icone: 'satellite',
    label: 'Detecte automatiquement',
    couleur: 'bg-primary-light text-primary border-primary/30',
  },
  citoyen: {
    icone: 'utilisateurs',
    label: 'Signale par la communaute',
    couleur: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  onacc: {
    icone: 'satellite',
    label: 'Detecte automatiquement',
    couleur: 'bg-primary-light text-primary border-primary/30',
  },
};

@Component({
  selector: 'app-source-badge',
  imports: [Icon],
  templateUrl: './source-badge.html',
  styles: ``,
})
export class SourceBadge {
  source = input.required<SourceAlerte>();

  config = computed(() => BADGE_SOURCE[this.source()]);
}

