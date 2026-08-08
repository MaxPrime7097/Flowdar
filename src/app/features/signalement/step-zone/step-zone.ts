import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NiveauAlerte, ZoneARisque } from '../../../core/models';
import { Icon, NomIcone } from '../../../shared/components/icon/icon';

const NIVEAUX: {
  valeur: NiveauAlerte;
  label: string;
  description: string;
  icone: NomIcone;
  fond: string;
  texte: string;
}[] = [
  { valeur: 'leger', label: 'Faible', description: 'Eau de pluie stagnante', icone: 'caution', fond: 'bg-caution', texte: 'text-caution' },
  { valeur: 'moyen', label: 'Moyen', description: 'Circulation difficile', icone: 'warning', fond: 'bg-warning', texte: 'text-warning' },
  { valeur: 'dangereux', label: 'Dangereux', description: 'Acces impossible / danger', icone: 'danger', fond: 'bg-danger', texte: 'text-danger' },
];

// Etape 1 : quartier connu OU 'zone non repertoriee' + GPS, selecteur de niveau
// (Frontend Specifications v3, section 4 - Ecran 4). Cartes de niveau descriptives
// alignees sur la maquette Stitch signaler_une_inondation.
@Component({
  selector: 'app-step-zone',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './step-zone.html',
  styleUrl: './step-zone.css',
})
export class StepZone {
  group = input.required<FormGroup>();
  zones = input.required<ZoneARisque[]>();
  positionPrete = input(false);

  demanderPosition = output<void>();

  readonly niveaux = NIVEAUX;
}
