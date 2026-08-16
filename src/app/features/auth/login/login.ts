import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ErrorBanner } from '../../../shared/components/error-banner/error-banner';
import { Icon } from '../../../shared/components/icon/icon';

// Email + mot de passe + Google Sign-In (Frontend Specifications v3, section 4 - Ecran 7)
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ErrorBanner, Icon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  erreur = signal<string | null>(null);
  message = signal<string | null>(null);
  enCours = signal(false);
  motDePasseVisible = signal(false);

  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', Validators.required),
  });

  connexion() {
    if (this.form.invalid) {
      return;
    }
    this.erreur.set(null);
    this.enCours.set(true);
    const { email, password } = this.form.getRawValue();
    this.authService.connexionEmail(email, password).then(
      () => this.router.navigateByUrl('/carte'),
      () => {
        this.erreur.set('Email ou mot de passe incorrect.');
        this.enCours.set(false);
      },
    );
  }

  connexionGoogle() {
    this.erreur.set(null);
    this.authService.connexionGoogle().then(
      () => this.router.navigateByUrl('/carte'),
      () => this.erreur.set('Connexion Google echouee.'),
    );
  }

  motDePasseOublie() {
    const email = this.form.controls.email;
    if (email.invalid) {
      email.markAsTouched();
      this.message.set(null);
      this.erreur.set("Saisissez d'abord votre adresse e-mail ci-dessus.");
      return;
    }
    this.erreur.set(null);
    this.authService.reinitialiserMotDePasse(email.value).then(
      () => this.message.set('E-mail de reinitialisation envoye. Verifiez votre boite de reception.'),
      // Message volontairement identique en cas d'echec : ne pas reveler si un compte existe
      // pour cette adresse (evite l'enumeration de comptes).
      () => this.message.set('E-mail de reinitialisation envoye. Verifiez votre boite de reception.'),
    );
  }
}
