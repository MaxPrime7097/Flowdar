import { Component, input, output } from '@angular/core';

import { Alerte } from '../../../core/models';
import { Icon } from '../../../shared/components/icon/icon';

// Chip recapitulatif d'une alerte, affiche en superposition de la carte pour completer
// les marqueurs natifs Google Maps (poses imperativement par MapsService.ajouterMarqueur) -
// Frontend Specifications v3, section 2.
@Component({
  selector: 'app-carte-marqueur',
  imports: [Icon],
  templateUrl: './carte-marqueur.html',
  styleUrl: './carte-marqueur.css',
})
export class CarteMarqueur {
  alerte = input.required<Alerte>();
  selectionner = output<Alerte>();
}
