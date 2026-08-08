import { Component, effect, input, signal } from '@angular/core';

// Succes : bandeau vert 3 secondes, pas de page de confirmation (DESIGN.md section 6).
// Se reaffiche a chaque nouveau message recu, meme identique (cle basee sur Date.now()).
@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styles: ``,
})
export class Toast {
  message = input<string | null>(null);

  visible = signal(false);
  private minuteur?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const message = this.message();
      clearTimeout(this.minuteur);
      if (!message) {
        this.visible.set(false);
        return;
      }
      this.visible.set(true);
      this.minuteur = setTimeout(() => this.visible.set(false), 3000);
    });
  }
}
