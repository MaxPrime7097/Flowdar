import { Component, computed, input } from '@angular/core';

// Etat affiche : les statuts v4 + "preventif" quand l'alerte est de type preventive
// (Frontend Specifications v4, section 2.2)
export type EtatBadgeStatut = 'actif' | 'resolu' | 'en_resolution' | 'preventif' | 'resolue';

const LABEL: Record<EtatBadgeStatut, string> = {
  actif: 'EN COURS',
  resolu: 'RÉSOLU',
  en_resolution: 'EN RÉSOLUTION',
  preventif: 'À VENIR',
  resolue: 'DÉGAGÉE',
};

const CLASSES: Record<EtatBadgeStatut, string> = {
  actif: 'bg-red-100 text-red-700 border-red-300',
  resolu: 'bg-slate-100 text-slate-600 border-slate-300',
  en_resolution: 'bg-orange-100 text-orange-700 border-orange-300',
  preventif: 'bg-blue-100 text-blue-700 border-blue-300',
  resolue: 'bg-slate-100 text-slate-600 border-slate-300',
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
