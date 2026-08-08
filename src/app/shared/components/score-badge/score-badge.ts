import { Component, computed, input } from '@angular/core';

import { NiveauAlerte } from '../../../core/models';

// Score Badge (DESIGN.md section 5, retravaille pour matcher les maquettes Stitch) :
// - "petit"  : puce compacte rectangle arrondi (marqueurs carte / bottom sheet)
// - "detail" : bloc plein ecran colore avec score + label de niveau (Ecran 2)
type TailleBadge = 'petit' | 'detail';

const LABEL_NIVEAU: Record<NiveauAlerte, string> = {
  leger: 'LEGER',
  moyen: 'MOYEN',
  dangereux: 'DANGEREUX',
};

function couleurFond(score: number): string {
  if (score >= 85) return 'bg-danger';
  if (score >= 60) return 'bg-warning';
  if (score >= 30) return 'bg-caution';
  return 'bg-[#94A3B8]';
}

@Component({
  selector: 'app-score-badge',
  imports: [],
  templateUrl: './score-badge.html',
  styles: ``,
})
export class ScoreBadge {
  score = input.required<number>();
  taille = input<TailleBadge>('petit');
  niveau = input<NiveauAlerte | null>(null);

  couleurFond = computed(() => couleurFond(this.score()));
  labelNiveau = computed(() => (this.niveau() ? LABEL_NIVEAU[this.niveau()!] : null));
}
