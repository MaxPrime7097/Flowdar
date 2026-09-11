import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

// Redirige vers /auth si non connecte (Frontend Specifications v3, section 3).
// Desactive en mode mock pour pouvoir parcourir toutes les pages sans compte Firebase reel.
export const authGuard: CanActivateFn = () => {
  if (environment.useMockData) {
    return true;
  }
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.estConnecte() ? true : router.parseUrl('/auth');
};
