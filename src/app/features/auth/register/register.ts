import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ZoneService } from '../../../core/services/zone.service';
import { ZoneARisque } from '../../../core/models';
import { ErrorBanner } from '../../../shared/components/error-banner/error-banner';
import { Icon } from '../../../shared/components/icon/icon';

// Email + mot de passe + Google Sign-In + quartier de domicile (Frontend Specifications v3, Ecran 7)
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ErrorBanner, Icon],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly zoneService = inject(ZoneService);
  private readonly router = inject(Router);

  erreur = signal<string | null>(null);
  enCours = signal(false);
  motDePasseVisible = signal(false);
  zones = signal<ZoneARisque[]>([]);

  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    quartierDomicile: this.fb.nonNullable.control('', Validators.required),
  });

  constructor() {
    this.zoneService.getZonesARisque().subscribe((zones) => this.zones.set(zones));
  }

  inscription() {
    if (this.form.invalid) {
      return;
    }
    this.erreur.set(null);
    this.enCours.set(true);
    const { email, password, quartierDomicile } = this.form.getRawValue();
    this.authService.inscription(email, password, quartierDomicile).then(
      () => this.router.navigateByUrl('/'),
      () => {
        this.erreur.set("Impossible de creer le compte.");
        this.enCours.set(false);
      },
    );
  }

  connexionGoogle() {
    this.erreur.set(null);
    this.authService.connexionGoogle().then(
      () => this.router.navigateByUrl('/'),
      () => this.erreur.set('Connexion Google echouee.'),
    );
  }
}
