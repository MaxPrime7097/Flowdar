import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Icon, NomIcone } from '../icon/icon';

interface OngletNav {
  route: string;
  label: string;
  icone: NomIcone;
  exact: boolean;
}

// Bottom navigation permanente : Carte / Preventives / Itineraire / Historique / Profil
// (DESIGN.md section 5 "Bottom Navigation" - Frontend Specifications v3, section 2)
const ONGLETS: OngletNav[] = [
  { route: '/', label: 'Carte', icone: 'carte', exact: true },
  { route: '/preventives', label: 'Prevention', icone: 'preventives', exact: false },
  { route: '/itineraire', label: 'Itineraire', icone: 'itineraire', exact: false },
  { route: '/historique', label: 'Historique', icone: 'historique', exact: false },
  // Pas de route /profil dans Frontend Specifications v3 (section 3) : ecran ajoute cote
  // Angular (lit uniquement Firebase Auth/Firestore, aucune API backend requise). Protege par
  // authGuard, qui redirige vers /auth si l'utilisateur n'est pas connecte.
  { route: '/profil', label: 'Profil', icone: 'profil', exact: false },
];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  readonly onglets = ONGLETS;
}
