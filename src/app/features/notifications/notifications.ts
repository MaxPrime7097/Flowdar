import { Component, inject, signal } from '@angular/core';

import { PushService } from '../../core/services/push.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Icon } from '../../shared/components/icon/icon';
import { Navbar } from '../../shared/components/navbar/navbar';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';
import { TempsEcoulePipe } from '../../shared/pipes/temps-ecoule.pipe';

// Ecran Notifications - cible de la cloche presente sur tous les ecrans.
// Gere l'activation des notifications push et affiche l'historique local des messages recus.
@Component({
  selector: 'app-notifications',
  imports: [TopAppBar, Icon, Navbar, EmptyState, TempsEcoulePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  private readonly pushService = inject(PushService);

  readonly etatPermission = this.pushService.etatPermission;
  readonly notifications = this.pushService.notifications;

  activationEnCours = signal(false);
  echecActivation = signal(false);

  constructor() {
    // Les notifications affichees deviennent "lues" des la consultation de l'ecran.
    this.pushService.marquerToutesLues();
  }

  async activer() {
    this.activationEnCours.set(true);
    this.echecActivation.set(false);
    const succes = await this.pushService.activer();
    this.activationEnCours.set(false);
    this.echecActivation.set(!succes);
  }

  vider() {
    this.pushService.viderHistorique();
  }
}
