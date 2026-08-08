import { Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Icon } from '../../../shared/components/icon/icon';

// Etape 2 : description libre + upload photo optionnel (Frontend Specifications v3, section 4).
// Grille MEDIA avec previsualisation, alignee sur la maquette Stitch signaler_une_inondation.
@Component({
  selector: 'app-step-details',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './step-details.html',
  styleUrl: './step-details.css',
})
export class StepDetails {
  group = input.required<FormGroup>();
  photoSelectionnee = input<File | null>(null);

  photoChangee = output<File | null>();

  private readonly fichierInput = viewChild<ElementRef<HTMLInputElement>>('fichierInput');
  apercuUrl = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const fichier = this.photoSelectionnee();
      if (!fichier) {
        this.apercuUrl.set(null);
        return;
      }
      const url = URL.createObjectURL(fichier);
      this.apercuUrl.set(url);
      onCleanup(() => URL.revokeObjectURL(url));
    });
  }

  ouvrirSelecteur() {
    this.fichierInput()?.nativeElement.click();
  }

  onFichierChoisi(event: Event) {
    const fichier = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.photoChangee.emit(fichier);
  }
}
