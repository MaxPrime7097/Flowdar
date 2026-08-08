import { describe, expect, it } from 'vitest';

import { determinerStatut } from './maps.service';
import { Alerte } from '../models';

function alerte(nom: string, score = 80): Alerte {
  return {
    id: nom,
    type: 'active',
    source: 'auto',
    zone_id: nom,
    score,
    niveau: 'dangereux',
    heure_debut: new Date().toISOString(),
    heure_prevue: null,
    nb_confirmations: 0,
    statut: 'actif',
    photo_url: null,
    firestore_id: nom,
    nom_quartier: nom,
    lat: 4.05,
    lng: 9.76,
  };
}

describe("Statut de securite de l'itineraire", () => {
  it('aucune zone concernee -> degage', () => {
    expect(determinerStatut([], [])).toBe('degage');
  });

  it('des zones contournees mais aucune traversee -> evite', () => {
    expect(determinerStatut([], [alerte('Ndokotti')])).toBe('evite');
  });

  it('une zone traversee -> traverse', () => {
    expect(determinerStatut([alerte('Ndokotti')], [])).toBe('traverse');
  });

  // Regression : c'est le cas qui affichait auparavant le bandeau vert "Itineraire praticable"
  // alors que le trajet passait pres d'une zone inondee.
  it('une zone traversee prime sur les zones evitees -> traverse, jamais degage', () => {
    const statut = determinerStatut([alerte('Ndokotti')], [alerte('Bepanda')]);
    expect(statut).toBe('traverse');
    expect(statut).not.toBe('degage');
  });

  it('plusieurs zones traversees -> traverse', () => {
    expect(determinerStatut([alerte('Ndokotti'), alerte('Bepanda')], [])).toBe('traverse');
  });
});
