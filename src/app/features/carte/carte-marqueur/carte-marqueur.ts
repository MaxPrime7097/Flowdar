import { Component, input, output } from '@angular/core';

import { Alerte } from '../../../core/models';
import { ScoreBadge } from '../../../shared/components/score-badge/score-badge';

// Chip recapitulatif d'une alerte, affiche en superposition de la carte pour completer
// les marqueurs natifs Google Maps (poses imperativement par MapsService.ajouterMarqueur) -
// Frontend Specifications v3, section 2.
@Component({
  selector: 'app-carte-marqueur',
  imports: [ScoreBadge],
  templateUrl: './carte-marqueur.html',
  styleUrl: './carte-marqueur.css',
})
export class CarteMarqueur {
  alerte = input.required<Alerte>();
  selectionner = output<Alerte>();
}
