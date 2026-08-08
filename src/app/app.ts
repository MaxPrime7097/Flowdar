import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AlerteService } from './core/services/alerte.service';
import { PushService } from './core/services/push.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Force l'instanciation immediate d'AlerteService (peu importe l'ecran d'entree) pour que
  // son ecouteur 'online' - qui rejoue la file d'attente des signalements hors ligne - soit
  // actif des le chargement de l'app.
  private readonly alerteService = inject(AlerteService);
  private readonly pushService = inject(PushService);

  constructor() {
    // Determine l'etat des notifications et se remet a l'ecoute si la permission a deja
    // ete accordee. Aucune demande de permission ici : elle doit suivre un clic explicite
    // de l'utilisateur (ecran /notifications).
    this.pushService.initialiser();
  }
}
