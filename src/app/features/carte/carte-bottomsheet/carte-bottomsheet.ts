import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Alerte } from '../../../core/models';
import { TempsEcoulePipe } from '../../../shared/pipes/temps-ecoule.pipe';
import { BadgeNiveau } from '../../../shared/components/badge-niveau/badge-niveau';
import { Icon } from '../../../shared/components/icon/icon';
import { ScoreBadge } from '../../../shared/components/score-badge/score-badge';

// Popup au clic marqueur : quartier, score, niveau, heure, nb confirmations
// (Frontend Specifications v3, section 4 - Ecran 1)
@Component({
  selector: 'app-carte-bottomsheet',
  imports: [ScoreBadge, BadgeNiveau, TempsEcoulePipe, RouterLink, Icon],
  templateUrl: './carte-bottomsheet.html',
  styleUrl: './carte-bottomsheet.css',
})
export class CarteBottomsheet {
  alerte = input.required<Alerte>();
  fermer = output<void>();
}
