import {
  Alerte,
  Confirmation,
  MeteoActuelle,
  PrevisionHoraire,
  PrevisionZone,
  ScoreActuel,
  Utilisateur,
  ZoneARisque,
} from './models';

// Quartiers precharges au lancement (Cahier des Charges v3, section 18)
export const MOCK_ZONES: ZoneARisque[] = [
  { id: 'zone-ndokotti', nom_quartier: 'Ndokotti', lat: 4.0511, lng: 9.7679, altitude_m: 8, proximite_eau_m: 120, niveau_risque_base: 'eleve', seuil_score: 12, nb_occurrences: 14, source: 'onacc' },
  { id: 'zone-bepanda', nom_quartier: 'Bepanda', lat: 4.0622, lng: 9.7510, altitude_m: 14, proximite_eau_m: 300, niveau_risque_base: 'moyen', seuil_score: 18, nb_occurrences: 9, source: 'onacc' },
  { id: 'zone-makepe', nom_quartier: 'Makepe', lat: 4.0833, lng: 9.7500, altitude_m: 20, proximite_eau_m: 450, niveau_risque_base: 'moyen', seuil_score: 20, nb_occurrences: 6, source: 'historique_terrain' },
  { id: 'zone-logpom', nom_quartier: 'Logpom', lat: 4.0950, lng: 9.7200, altitude_m: 11, proximite_eau_m: 200, niveau_risque_base: 'eleve', seuil_score: 15, nb_occurrences: 11, source: 'onacc' },
  { id: 'zone-pk8-pk14', nom_quartier: 'PK8-PK14', lat: 4.1200, lng: 9.7400, altitude_m: 25, proximite_eau_m: 600, niveau_risque_base: 'faible', seuil_score: 25, nb_occurrences: 3, source: 'historique_terrain' },
  { id: 'zone-ndog-bong', nom_quartier: 'Ndog-Bong', lat: 4.0400, lng: 9.7100, altitude_m: 6, proximite_eau_m: 80, niveau_risque_base: 'eleve', seuil_score: 10, nb_occurrences: 17, source: 'onacc' },
  { id: 'zone-melen', nom_quartier: 'Melen', lat: 4.0300, lng: 9.7300, altitude_m: 22, proximite_eau_m: 500, niveau_risque_base: 'faible', seuil_score: 28, nb_occurrences: 2, source: 'historique_terrain' },
];

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const hoursFromNow = (h: number) => new Date(now + h * 3600_000).toISOString();

// Alertes de demo couvrant les 3 niveaux + les 2 types (respecte les combinaisons valides v3 :
// preventive => leger/moyen uniquement, active => leger/moyen/dangereux)
export const MOCK_ALERTES: Alerte[] = [
  {
    id: 'alerte-1', type: 'active', source: 'citoyen', zone_id: 'zone-ndokotti',
    score: 87, niveau: 'dangereux', heure_debut: hoursAgo(2), heure_prevue: null,
    nb_confirmations: 6, nb_resolutions: 0, statut: 'actif', photo_url: null, firestore_id: 'alerte-1',
    score_detail: { meteo: 32, historique: 18, citoyens: 14, geographie: 7 },
    nom_quartier: 'Ndokotti', lat: 4.0511, lng: 9.7679,
  },
  {
    id: 'alerte-2', type: 'active', source: 'auto', zone_id: 'zone-ndog-bong',
    score: 68, niveau: 'moyen', heure_debut: hoursAgo(1), heure_prevue: null,
    nb_confirmations: 3, nb_resolutions: 0, statut: 'actif', photo_url: null, firestore_id: 'alerte-2',
    score_detail: { meteo: 28, historique: 20, citoyens: 12, geographie: 8 },
    nom_quartier: 'Ndog-Bong', lat: 4.0400, lng: 9.7100,
  },
  {
    id: 'alerte-3', type: 'preventive', source: 'auto', zone_id: 'zone-logpom',
    score: 42, niveau: 'leger', heure_debut: hoursAgo(0.2), heure_prevue: hoursFromNow(3),
    nb_confirmations: 0, nb_resolutions: 0, statut: 'actif', photo_url: null, firestore_id: 'alerte-3',
    score_detail: { meteo: 20, historique: 12, citoyens: 6, geographie: 4 },
    nom_quartier: 'Logpom', lat: 4.0950, lng: 9.7200,
  },
  {
    id: 'alerte-4', type: 'active', source: 'auto', zone_id: 'zone-ndokotti',
    score: 61, niveau: 'moyen', heure_debut: hoursAgo(5), heure_prevue: null,
    nb_confirmations: 2, nb_resolutions: 0, statut: 'resolu', photo_url: null, firestore_id: 'alerte-4',
    score_detail: { meteo: 25, historique: 16, citoyens: 12, geographie: 8 },
    nom_quartier: 'Ndokotti', lat: 4.0511, lng: 9.7679,
  },
];

export const MOCK_SCORES: ScoreActuel[] = MOCK_ZONES.map((zone) => {
  const alerte = MOCK_ALERTES.find((a) => a.zone_id === zone.id);
  return { zone_id: zone.id, score: alerte?.score ?? 5, niveau: alerte?.niveau ?? 'leger' };
});

export const MOCK_METEO_ACTUELLE: MeteoActuelle[] = MOCK_ZONES.map((zone, i) => ({
  zone_id: zone.id,
  pluie_mm_h: [22, 14, 6, 18, 2, 26, 1][i] ?? 0,
  humidite: 70 + i,
}));

export const MOCK_PREVISIONS: PrevisionZone[] = [
  { zone_id: 'zone-logpom', heure_prevue: hoursFromNow(3), score_previsionnel: 55 },
  { zone_id: 'zone-bepanda', heure_prevue: hoursFromNow(5), score_previsionnel: 38 },
];

// Bandeau horaire de l'ecran Prevention (5 prochaines heures a Douala)
export const MOCK_PREVISIONS_HORAIRES: PrevisionHoraire[] = [2, 8, 22, 11, 1].map((pluie, i) => ({
  heure: hoursFromNow(i + 1),
  pluie_mm_h: pluie,
}));

export const MOCK_CONFIRMATIONS: Confirmation[] = [
  { id: 'conf-1', alerte_id: 'alerte-1', user_uid: 'demo-user-1', type: 'confirme', created_at: hoursAgo(1.5) },
  { id: 'conf-2', alerte_id: 'alerte-1', user_uid: 'demo-user-2', type: 'confirme', created_at: hoursAgo(0.5) },
];

export const MOCK_UTILISATEUR: Utilisateur = {
  uid: 'demo-user-1',
  nom: 'Max Prime',
  email: 'max.prime@flowdar.cm',
  quartier_domicile: 'Ndokotti',
};
