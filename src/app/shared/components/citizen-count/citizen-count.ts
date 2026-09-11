import { Component, input } from '@angular/core';

import { Icon } from '../icon/icon';

// Citizen Count v4 - Affiche séparé du score: "X citoyens confirment" ou "X citoyens signalent..."
// (Frontend Specifications v4, section 2.4)
@Component({
  selector: 'app-citizen-count',
  imports: [Icon],
  templateUrl: './citizen-count.html',
  styles: ``,
})
export class CitizenCount {
  count = input.required<number>();
  type = input<'confirmation' | 'resolution'>('confirmation');
}
