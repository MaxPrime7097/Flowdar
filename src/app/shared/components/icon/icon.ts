import { Component, input } from '@angular/core';

// Icones inline, style Lucide (trait 2px, coins arrondis) - DESIGN.md section 5/7.
// Pas de dependance npm : evite un risque de compatibilite avec Angular 22 pour un
// jeu d'icones fixes, et pas de police d'icones externe (Material Symbols) non plus.
export type NomIcone =
  | 'carte'
  | 'preventives'
  | 'itineraire'
  | 'historique'
  | 'profil'
  | 'danger'
  | 'warning'
  | 'caution'
  | 'info'
  | 'fermer'
  | 'plus'
  | 'check'
  | 'cloche'
  | 'retour'
  | 'recherche'
  | 'localisation'
  | 'mail'
  | 'cadenas'
  | 'oeil'
  | 'envoyer'
  | 'appareil-photo'
  | 'calques'
  | 'cibler'
  | 'sos'
  | 'utilisateurs'
  | 'horloge'
  | 'chevron-droite'
  | 'chevron-bas'
  | 'filtre'
  | 'bouclier'
  | 'tendance'
  | 'voiture'
  | 'pluie'
  | 'nuage'
  | 'orage'
  | 'telephone'
  | 'goutte'
  | 'eclair'
  | 'trousse';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styles: ``,
})
export class Icon {
  nom = input.required<NomIcone>();
  taille = input(22);
}