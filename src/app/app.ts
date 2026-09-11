import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AlerteService } from './core/services/alerte.service';
import { PushService } from './core/services/push.service';
import { Splash } from './features/splash/splash';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Splash],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly alerteService = inject(AlerteService);
  private readonly pushService = inject(PushService);

  splashVisible = signal(true);

  constructor() {
    this.pushService.initialiser();
  }
}
