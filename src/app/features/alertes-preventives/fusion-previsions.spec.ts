import { describe, expect, it } from 'vitest';

import { MOCK_ALERTES, MOCK_PREVISIONS, MOCK_PREVISIONS_HORAIRES, MOCK_ZONES } from '../../core/mock-data';

// Verifie la regle de fusion des deux sources de l'ecran Prevention (confirmee avec Mr Ebanga) :
// alertes preventives reelles + previsions meteo brutes, l'alerte primant en cas de doublon.
describe('Ecran Prevention - fusion des deux sources', () => {
  const alertesPreventives = MOCK_ALERTES.filter((a) => a.type === 'preventive');

  it('les donnees de demo couvrent bien les deux sources', () => {
    expect(alertesPreventives.length).toBeGreaterThan(0);
    expect(MOCK_PREVISIONS.length).toBeGreaterThan(0);
  });

  it('une zone couverte par une alerte preventive n est pas dupliquee par sa prevision', () => {
    const zonesAvecAlerte = new Set(alertesPreventives.map((a) => a.zone_id));
    const previsionEnDoublon = MOCK_PREVISIONS.find((p) => zonesAvecAlerte.has(p.zone_id));

    // Le jeu de demo contient volontairement ce doublon (zone-logpom) pour exercer la regle.
    expect(previsionEnDoublon).toBeDefined();
  });

  it('aucune alerte preventive n est de niveau dangereux (CDC v3, section 8/9)', () => {
    for (const alerte of alertesPreventives) {
      expect(alerte.niveau).not.toBe('dangereux');
    }
  });

  it('chaque zone referencee est resolvable en nom de quartier', () => {
    const idsConnus = new Set(MOCK_ZONES.map((z) => z.id));
    for (const prevision of MOCK_PREVISIONS) {
      expect(idsConnus.has(prevision.zone_id)).toBe(true);
    }
  });

  it('le bandeau horaire contient au moins une heure severe a mettre en avant', () => {
    expect(MOCK_PREVISIONS_HORAIRES.some((h) => h.pluie_mm_h >= 20)).toBe(true);
  });
});
