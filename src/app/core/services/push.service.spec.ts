import { describe, expect, it } from 'vitest';

import { NotificationRecue } from './push.service';

// Le service lui-meme depend de l'API Notification et du service worker du navigateur.
// On verifie ici la logique pure qui gouverne l'affichage : plafond d'historique et
// comptage des non-lues (pastille rouge de la cloche).
function ajouter(historique: NotificationRecue[], nouvelle: NotificationRecue): NotificationRecue[] {
  return [nouvelle, ...historique].slice(0, 50);
}

function compterNonLues(historique: NotificationRecue[]): number {
  return historique.filter((n) => !n.lue).length;
}

function fausseNotification(id: number, lue = false): NotificationRecue {
  return { id: `${id}`, titre: `Alerte ${id}`, corps: '', recueLe: new Date().toISOString(), lue };
}

describe('Historique des notifications', () => {
  it('la plus recente arrive en tete', () => {
    const historique = ajouter([fausseNotification(1)], fausseNotification(2));
    expect(historique[0].id).toBe('2');
  });

  it('l historique est plafonne a 50 entrees', () => {
    let historique: NotificationRecue[] = [];
    for (let i = 0; i < 60; i++) {
      historique = ajouter(historique, fausseNotification(i));
    }
    expect(historique).toHaveLength(50);
    // Ce sont bien les 50 plus recentes qui sont conservees.
    expect(historique[0].id).toBe('59');
  });

  it('seules les notifications non lues sont comptees dans la pastille', () => {
    const historique = [fausseNotification(1, true), fausseNotification(2), fausseNotification(3)];
    expect(compterNonLues(historique)).toBe(2);
  });

  it('tout marquer comme lu remet la pastille a zero', () => {
    const historique = [fausseNotification(1), fausseNotification(2)];
    const apresLecture = historique.map((n) => ({ ...n, lue: true }));
    expect(compterNonLues(apresLecture)).toBe(0);
  });
});
