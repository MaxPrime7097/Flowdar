import { Component, input } from '@angular/core';

import { Icon } from '../icon/icon';

// Bandeau meteo actuelle (Frontend Specifications v3, section 2). En ligne : puce
// translucide flottante (maquette Stitch flowdar_carte_en_temps_r_el). Hors ligne :
// bandeau plein largeur persistant (DESIGN.md section 6).
@Component({
  selector: 'app-meteo-bandeau',
  imports: [Icon],
  templateUrl: './meteo-bandeau.html',
  styles: ``,
})
export class MeteoBandeau {
  nomQuartier = input<string | null>(null);
  pluieMmH = input<number | null>(null);
  horsLigne = input(false);
  derniereMaj = input<string | null>(null);
}
