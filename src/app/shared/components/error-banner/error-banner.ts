import { Component, input } from '@angular/core';

// Erreur : bandeau rouge discret en haut, jamais de modal (DESIGN.md section 6)
@Component({
  selector: 'app-error-banner',
  imports: [],
  templateUrl: './error-banner.html',
  styles: ``,
})
export class ErrorBanner {
  message = input.required<string | null>();
}
