import { Injectable, signal } from '@angular/core';

import { Signalement } from '../models';

const CLE_STOCKAGE = 'flowdar_signalements_en_attente';

function lireStockage(): Signalement[] {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    return brut ? (JSON.parse(brut) as Signalement[]) : [];
  } catch {
    return [];
  }
}

// File d'attente localStorage pour les signalements envoyes sans reseau, rejoues a la
// reconnexion (Frontend Specifications v3, section 8 - "Signalement sans reseau").
// Ne gere pas la photo : un signalement hors ligne est mis en file sans photo_url, la photo
// necessitant un upload Firebase Storage impossible sans connexion.
@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  enAttente = signal<Signalement[]>(lireStockage());

  ajouter(signalement: Signalement) {
    this.ecrire([...this.enAttente(), signalement]);
  }

  retirer(signalement: Signalement) {
    this.ecrire(this.enAttente().filter((s) => s !== signalement));
  }

  private ecrire(file: Signalement[]) {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(file));
    this.enAttente.set(file);
  }
}
