import { beforeEach, describe, expect, it } from 'vitest';

import { OfflineQueueService } from './offline-queue.service';

const CLE = 'flowdar_signalements_en_attente';

describe('OfflineQueueService', () => {
  beforeEach(() => localStorage.clear());

  it('demarre vide quand localStorage est vide', () => {
    expect(new OfflineQueueService().enAttente()).toEqual([]);
  });

  it('persiste un signalement ajoute', () => {
    const file = new OfflineQueueService();
    file.ajouter({ zone_id: 'zone-ndokotti', niveau: 'moyen', description: 'test' });

    expect(file.enAttente()).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(CLE)!)).toHaveLength(1);
  });

  it('relit la file depuis localStorage a la reconstruction (nouvelle session)', () => {
    const premiere = new OfflineQueueService();
    premiere.ajouter({ lat: 4.05, lng: 9.76, niveau: 'dangereux', description: 'GPS' });

    const seconde = new OfflineQueueService();
    expect(seconde.enAttente()).toHaveLength(1);
    expect(seconde.enAttente()[0]).toMatchObject({ niveau: 'dangereux' });
  });

  it('retire un signalement synchronise sans toucher aux autres', () => {
    const file = new OfflineQueueService();
    const a = { zone_id: 'a', niveau: 'leger' as const, description: 'A' };
    const b = { zone_id: 'b', niveau: 'moyen' as const, description: 'B' };
    file.ajouter(a);
    file.ajouter(b);

    file.retirer(file.enAttente()[0]);

    expect(file.enAttente()).toHaveLength(1);
    expect(file.enAttente()[0]).toMatchObject({ description: 'B' });
    expect(JSON.parse(localStorage.getItem(CLE)!)).toHaveLength(1);
  });

  it('survit a un localStorage corrompu', () => {
    localStorage.setItem(CLE, 'ceci-nest-pas-du-json');
    expect(new OfflineQueueService().enAttente()).toEqual([]);
  });
});
