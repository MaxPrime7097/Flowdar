import { Component, computed, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NiveauAlerte, ZoneARisque } from '../../../core/models';
import { Icon, NomIcone } from '../../../shared/components/icon/icon';
import { SelectCustom, SelectOption } from '../../../shared/components/select-custom/select-custom';

const NIVEAUX: {
  valeur: NiveauAlerte;
  label: string;
  description: string;
  icone: NomIcone;
  fond: string;
  fondClair: string;
  texte: string;
}[] = [
  { valeur: 'leger', label: 'Faible', description: '🟡 Flaque visible, on passe encore à pied', icone: 'alerte-leger', fond: 'bg-caution', fondClair: 'bg-caution-light', texte: 'text-caution' },
  { valeur: 'moyen', label: 'Moyen', description: '🟠 Eau à la cheville, voitures évitent la zone', icone: 'alerte-moyen', fond: 'bg-warning', fondClair: 'bg-warning-light', texte: 'text-warning' },
  { valeur: 'dangereux', label: 'Dangereux', description: '🔴 Eau au genou ou plus, route coupée', icone: 'alerte-dangereux', fond: 'bg-danger', fondClair: 'bg-danger-light', texte: 'text-danger' },
];

@Component({
  selector: 'app-step-zone',
  imports: [ReactiveFormsModule, Icon, SelectCustom],
  templateUrl: './step-zone.html',
  styleUrl: './step-zone.css',
})
export class StepZone {
  group = input.required<FormGroup>();
  zones = input.required<ZoneARisque[]>();
  positionPrete = input(false);
  demanderPosition = output<void>();
  readonly niveaux = NIVEAUX;

  zonesOptions = computed<SelectOption[]>(() =>
    this.zones().map((z) => ({ valeur: z.id, label: z.nom_quartier }))
  );

  get zoneIdValue(): string | null {
    return this.group().controls['zoneId'].value;
  }

  set zoneIdValue(val: string | null) {
    this.group().controls['zoneId'].setValue(val);
  }
}
