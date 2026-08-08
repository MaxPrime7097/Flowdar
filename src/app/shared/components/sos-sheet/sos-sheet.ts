import { Component, output } from '@angular/core';

import { NUMERO_URGENCE_UNIVERSEL, SERVICES_URGENCE } from '../../../core/urgence';
import { Icon } from '../icon/icon';

// Feuille de choix des services d'urgence. On propose les 3 services plutot qu'un seul
// numero en aveugle : pendant une inondation le besoin peut etre un sauvetage (pompiers),
// un blesse (SAMU) ou une route coupee (police).
@Component({
  selector: 'app-sos-sheet',
  imports: [Icon],
  templateUrl: './sos-sheet.html',
  styles: ``,
})
export class SosSheet {
  fermer = output<void>();

  readonly services = SERVICES_URGENCE;
  readonly numeroUniversel = NUMERO_URGENCE_UNIVERSEL;
}
