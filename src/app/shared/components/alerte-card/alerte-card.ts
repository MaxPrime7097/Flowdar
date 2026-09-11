import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Alerte, BORDURE_PAR_NIVEAU, LABEL_SOURCE_ALERTE, NiveauAlerte, SourceAlerte } from '../../../core/models';
import { Icon, NomIcone } from '../icon/icon';

const MOIS_FR = [
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
];

const LABEL_SEVERITE: Record<NiveauAlerte, string> = {
  leger: 'MODERE',
  moyen: 'AVERTISSEMENT',
  dangereux: 'CRITIQUE',
};

const CLASSES_SEVERITE: Record<NiveauAlerte, string> = {
  leger: 'bg-caution-light text-caution',
  moyen: 'bg-warning-light text-warning',
  dangereux: 'bg-danger-light text-danger',
};

const COULEUR_SCORE: Record<NiveauAlerte, string> = {
  leger: 'text-caution',
  moyen: 'text-warning',
  dangereux: 'text-danger',
};

const ICONE_SOURCE: Record<SourceAlerte, NomIcone> = {
  auto: 'robot',
  citoyen: 'megaphone',
  onacc: 'robot',
};

const COULEUR_SOURCE: Record<SourceAlerte, string> = {
  auto: 'text-primary',
  citoyen: 'text-warning',
  onacc: 'text-primary',
};

// Alerte Card - composant signature (DESIGN.md section 5) : bordure gauche coloree selon niveau,
// date + pastille de severite / source + confirmations / score. Mise en page alignee sur la
// maquette Stitch historique_des_alertes. Le modele Alerte n'expose pas de duree calculee
// (pas de heure_fin cote backend) : on affiche la source de l'alerte a la place, un champ reel.
@Component({
  selector: 'app-alerte-card',
  imports: [Icon, RouterLink],
  templateUrl: './alerte-card.html',
  styles: ``,
})
export class AlerteCard {
  alerte = input.required<Alerte>();

  bordure = computed(() => BORDURE_PAR_NIVEAU[this.alerte().niveau]);
  labelSource = computed(() => LABEL_SOURCE_ALERTE[this.alerte().source]);
  iconeSource = computed(() => ICONE_SOURCE[this.alerte().source]);
  couleurSource = computed(() => COULEUR_SOURCE[this.alerte().source]);
  labelSeverite = computed(() => LABEL_SEVERITE[this.alerte().niveau]);
  classesSeverite = computed(() => CLASSES_SEVERITE[this.alerte().niveau]);
  couleurScore = computed(() => COULEUR_SCORE[this.alerte().niveau]);

  dateFormatee = computed(() => {
    const date = new Date(this.alerte().heure_debut);
    return `${date.getDate()} ${MOIS_FR[date.getMonth()]}`;
  });
}
