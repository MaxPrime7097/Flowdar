import { Component, computed, input } from '@angular/core';

import { NiveauAlerte } from '../../../core/models';
import { Icon, NomIcone } from '../icon/icon';

// Badge texte + icone Leger/Moyen/Dangereux (DESIGN.md section 7 : jamais la couleur seule -
// icone + texte + couleur pour rester distinguable en vision daltonienne).
const LABEL_PAR_NIVEAU: Record<NiveauAlerte, string> = {
  leger: 'LEGER',
  moyen: 'MOYEN',
  dangereux: 'DANGEREUX',
};

const ICONE_PAR_NIVEAU: Record<NiveauAlerte, NomIcone> = {
  leger: 'caution',
  moyen: 'warning',
  dangereux: 'danger',
};

const CLASSES_PAR_NIVEAU: Record<NiveauAlerte, string> = {
  leger: 'bg-caution-light text-caution border-caution/30',
  moyen: 'bg-warning-light text-warning border-warning/30',
  dangereux: 'bg-danger-light text-danger border-danger/30',
};

@Component({
  selector: 'app-badge-niveau',
  imports: [Icon],
  templateUrl: './badge-niveau.html',
  styles: ``,
})
export class BadgeNiveau {
  niveau = input.required<NiveauAlerte>();

  label = computed(() => LABEL_PAR_NIVEAU[this.niveau()]);
  icone = computed(() => ICONE_PAR_NIVEAU[this.niveau()]);
  classes = computed(() => CLASSES_PAR_NIVEAU[this.niveau()]);
}
