import { Component, computed, input, model, signal } from '@angular/core';
import { Icon } from '../icon/icon';

export interface SelectOption {
  valeur: string;
  label: string;
}

@Component({
  selector: 'app-select-custom',
  imports: [Icon],
  templateUrl: './select-custom.html',
})
export class SelectCustom {
  options = input.required<SelectOption[]>();
  placeholder = input('Choisir...');
  valeur = model<string | null>(null);

  ouvert = signal(false);

  selectionne = computed(() =>
    this.options().find((o) => o.valeur === this.valeur()) ?? null
  );

  choisir(option: SelectOption) {
    this.valeur.set(option.valeur);
    this.ouvert.set(false);
  }

  estSelectionne(valeur: string): boolean {
    return valeur === this.valeur();
  }
}
