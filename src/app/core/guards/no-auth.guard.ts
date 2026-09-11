import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

// Redirige vers / si deja connecte (Frontend Specifications v3, section 3).
// Desactive en mode mock : sinon estConnecte()===true rendrait /auth inaccessible (voir
// AuthService.estConnecte).
export const noAuthGuard: CanActivateFn = () => {
  if (environment.useMockData) {
    return true;
  }
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.estConnecte() ? router.parseUrl('/carte') : true;
};
