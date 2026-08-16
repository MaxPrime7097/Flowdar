import { Component, computed, input } from '@angular/core';

// Risk Gauge v4 - Jauge + label + score/100 séparé (jamais le chiffre seul)
// (Frontend Specifications v4, section 2.3)
interface RiskConfig {
  label: string;
  couleurJauge: string;
  couleurTexte: string;
}

const RISK_LEVELS: Record<string, RiskConfig> = {
  none: {
    label: 'Aucun risque',
    couleurJauge: 'bg-slate-400',
    couleurTexte: 'text-slate-600',
  },
  leger: {
    label: 'Risque leger',
    couleurJauge: 'bg-yellow-400',
    couleurTexte: 'text-yellow-700',
  },
  moyen: {
    label: 'Risque moyen',
    couleurJauge: 'bg-orange-500',
    couleurTexte: 'text-orange-700',
  },
  eleve: {
    label: 'Risque eleve',
    couleurJauge: 'bg-red-500',
    couleurTexte: 'text-red-700',
  },
};

@Component({
  selector: 'app-risk-gauge',
  imports: [],
  templateUrl: './risk-gauge.html',
  styles: ``,
})
export class RiskGauge {
  score = input.required<number>();

  riskLevel = computed(() => {
    const s = this.score();
    if (s < 30) return 'none';
    if (s < 60) return 'leger';
    if (s < 85) return 'moyen';
    return 'eleve';
  });

  config = computed(() => RISK_LEVELS[this.riskLevel()]);
}
