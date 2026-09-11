import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Utilisateur } from '../../core/models';
import { Icon } from '../../shared/components/icon/icon';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';

// Ecran Profil - non specifie dans Frontend Specifications v3 (section 3/4), ajoute pour que
// l'onglet 'Profil' de la bottom navigation mene vers un ecran reel plutot que /auth.
// Ne consomme aucune API backend : lit uniquement Firebase Auth/Firestore (deja en place pour
// l'inscription).
@Component({
  selector: 'app-profil',
  imports: [TopAppBar, Icon, Navbar, Skeleton],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  utilisateur = signal<Utilisateur | null | undefined>(undefined);
  deconnexionEnCours = signal(false);

  chargement = computed(() => this.utilisateur() === undefined);

  initiale = computed(() => {
    const nom = this.utilisateur()?.nom?.trim();
    return nom ? nom.charAt(0).toUpperCase() : '?';
  });

  constructor() {
    this.authService.getProfil().subscribe((utilisateur) => this.utilisateur.set(utilisateur));
  }

  async deconnexion() {
    this.deconnexionEnCours.set(true);
    await this.authService.deconnexion();
    this.router.navigateByUrl('/auth');
  }
}
