import { Component, computed, input } from '@angular/core';

// Etat affiche : les 3 valeurs du champ statut, plus "preventif" quand l'alerte est de type
// preventive (Frontend Specifications v3 liste le badge comme Actif/Resolu/Preventif).
export type EtatBadgeStatut = 'actif' | 'resolu' | 'en_resolution' | 'preventif';

const LABEL: Record<EtatBadgeStatut, string> = {
  actif: 'ACTIF',
  resolu: 'RESOLU',
  en_resolution: 'EN RESOLUTION',
  preventif: 'PREVENTIF',
};

const CLASSES: Record<EtatBadgeStatut, string> = {
  actif: 'bg-danger-light text-danger border-danger/30',
  resolu: 'bg-[#F1F5F9] text-text-secondary border-border',
  en_resolution: 'bg-warning-light text-warning border-warning/30',
  preventif: 'bg-primary-light text-primary border-primary/30',
};

@Component({
  selector: 'app-badge-statut',
  imports: [],
  templateUrl: './badge-statut.html',
  styles: ``,
})
export class BadgeStatut {
  etat = input.required<EtatBadgeStatut>();

  label = computed(() => LABEL[this.etat()]);
  classes = computed(() => CLASSES[this.etat()]);
}
