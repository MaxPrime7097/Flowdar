import { describe, expect, it } from 'vitest';

// Regle de l'ecran Prevention : on n'affiche que les zones a risque "dans les 6 prochaines
// heures" (Frontend Specifications v3, section 4 - Ecran 3). Une echeance deja passee reste
// visible car le risque est en cours ; seul l'au-dela de 6 h est ecarte.
const FENETRE_PREVISION_H = 6;

function dansLaFenetre(heureISO: string, maintenant = Date.now()): boolean {
  return new Date(heureISO).getTime() <= maintenant + FENETRE_PREVISION_H * 3600_000;
}

const dans = (heures: number) => new Date(Date.now() + heures * 3600_000).toISOString();

describe('Fenetre des 6 prochaines heures', () => {
  it('garde une echeance dans 3 h', () => {
    expect(dansLaFenetre(dans(3))).toBe(true);
  });

  it('garde une echeance juste sous la limite (5h59)', () => {
    expect(dansLaFenetre(dans(5.98))).toBe(true);
  });

  it('ecarte une echeance a 7 h', () => {
    expect(dansLaFenetre(dans(7))).toBe(false);
  });

  it('ecarte une echeance a 12 h', () => {
    expect(dansLaFenetre(dans(12))).toBe(false);
  });

  it('garde une echeance deja passee : le risque est en cours', () => {
    expect(dansLaFenetre(dans(-2))).toBe(true);
  });
});
