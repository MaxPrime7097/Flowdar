import { Component, signal } from '@angular/core';

import { Icon } from '../../shared/components/icon/icon';
import { Login } from './login/login';
import { Register } from './register/register';

// Ecran 7 - Connexion / Inscription (Frontend Specifications v3, section 4). Mise en page
// alignee sur la maquette Stitch connexion_flowdar.
@Component({
  selector: 'app-auth',
  imports: [Login, Register, Icon],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  mode = signal<'login' | 'inscription'>('login');
}
