import { Component, computed, input } from '@angular/core';

import { ScoreDetail } from '../../../core/models';

interface Segment {
  label: string;
  valeur: number;
  max: number;
  couleur: string;
}

// Barre segmentee horizontale : Meteo X/40 + Historique X/30 + Citoyens X/20 + Geographie X/10
// (NOUVEAU v3 - Frontend Specifications v3, section 2/4)
@Component({
  selector: 'app-score-breakdown',
  imports: [],
  templateUrl: './score-breakdown.html',
  styleUrl: './score-breakdown.css',
})
export class ScoreBreakdown {
  detail = input.required<ScoreDetail>();

  // Couleurs exactes DESIGN.md section 5 "Barre de decomposition du score"
  segments = computed<Segment[]>(() => [
    { label: 'Meteo', valeur: this.detail().meteo, max: 40, couleur: 'bg-primary' },
    { label: 'Historique', valeur: this.detail().historique, max: 30, couleur: 'bg-[#7C3AED]' },
    { label: 'Citoyens', valeur: this.detail().citoyens, max: 20, couleur: 'bg-warning' },
    { label: 'Geographie', valeur: this.detail().geographie, max: 10, couleur: 'bg-success' },
  ]);
}
