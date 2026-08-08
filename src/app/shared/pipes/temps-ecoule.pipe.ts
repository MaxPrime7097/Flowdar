import { Pipe, PipeTransform } from '@angular/core';

// 'il y a 2h' depuis un timestamp ISO (Frontend Specifications v3, section 2)
@Pipe({
  name: 'tempsEcoule',
  pure: false, // se rafraichit periodiquement sans recreer le pipe (heure_debut ne change pas)
})
export class TempsEcoulePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const secondes = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (secondes < 60) {
      return "à l'instant";
    }
    const minutes = Math.floor(secondes / 60);
    if (minutes < 60) {
      return `il y a ${minutes} min`;
    }
    const heures = Math.floor(minutes / 60);
    if (heures < 24) {
      return `il y a ${heures}h`;
    }
    const jours = Math.floor(heures / 24);
    return `il y a ${jours}j`;
  }
}
