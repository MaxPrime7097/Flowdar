import { Component, input } from '@angular/core';

// Chargement : skeleton screens, jamais de spinner centre (DESIGN.md section 6).
// Meme layout que le contenu final - une carte le temps du chargement.
@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.html',
  styles: ``,
})
export class Skeleton {
  hauteur = input(80);
}
