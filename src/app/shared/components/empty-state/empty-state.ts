import { Component, input, output } from '@angular/core';

// Etat vide : illustration minimaliste + texte court + action suggeree (DESIGN.md section 6)
@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styles: ``,
})
export class EmptyState {
  titre = input.required<string>();
  description = input<string | null>(null);
  labelAction = input<string | null>(null);

  action = output<void>();
}
