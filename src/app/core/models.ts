// Modeles alignes sur le contrat JSON du backend (Flowdar_Specifications_Backend_v3, section 2 et 4)

export type NiveauRisque = 'faible' | 'moyen' | 'eleve';
export type SourceZone = 'onacc' | 'historique_terrain' | 'signalement_citoyen';
export type TypeAlerte = 'preventive' | 'active';
export type SourceAlerte = 'auto' | 'citoyen' | 'onacc';
export type NiveauAlerte = 'leger' | 'moyen' | 'dangereux';
export type StatutAlerte = 'actif' | 'resolu' | 'en_resolution';
export type TypeConfirmation = 'confirme' | 'resolu';

export interface ZoneARisque {
  id: string;
  nom_quartier: string;
  lat: number;
  lng: number;
  altitude_m: number;
  proximite_eau_m: number;
  niveau_risque_base: NiveauRisque;
  seuil_score: number;
  nb_occurrences: number;
  source: SourceZone;
}

export interface ScoreDetail {
  meteo: number; // sur 40
  historique: number; // sur 30
  citoyens: number; // sur 20
  geographie: number; // sur 10
}

export interface Alerte {
  id: string;
  type: TypeAlerte;
  source: SourceAlerte;
  zone_id: string;
  score: number; // 0-100
  niveau: NiveauAlerte;
  heure_debut: string; // ISO timestamp
  heure_prevue: string | null;
  nb_confirmations: number;
  statut: StatutAlerte;
  photo_url: string | null;
  firestore_id: string;
  score_detail?: ScoreDetail; // present dans GET /api/alertes/:id
  // champs de confort ajoutes cote frontend pour l'affichage carte (denormalises depuis la zone)
  nom_quartier?: string;
  lat?: number;
  lng?: number;
}

export interface Confirmation {
  id: string;
  alerte_id: string;
  user_uid: string;
  type: TypeConfirmation;
  created_at: string;
}

export interface Utilisateur {
  uid: string;
  nom: string;
  email: string;
  quartier_domicile: string;
}

export interface ScoreActuel {
  zone_id: string;
  score: number;
  niveau: NiveauAlerte;
}

export interface MeteoActuelle {
  zone_id: string;
  pluie_mm_h: number;
  humidite: number;
}

export interface PrevisionZone {
  zone_id: string;
  heure_prevue: string;
  score_previsionnel: number;
}

// Previsions horaires a l'echelle de la ville (bandeau haut de l'ecran Prevention).
// Endpoint confirme par Mr Ebanga mais contrat pas encore fige : voir SETUP.md, section
// "A confirmer avec le backend". L'icone et le caractere "severe" sont derives cote Angular
// depuis pluie_mm_h (mise en forme, pas un calcul de score).
export interface PrevisionHoraire {
  heure: string; // ISO timestamp
  pluie_mm_h: number;
}

export interface SignalementZoneConnue {
  zone_id: string;
  niveau: NiveauAlerte;
  description: string;
  photo_url?: string;
}

export interface SignalementZoneInconnue {
  lat: number;
  lng: number;
  niveau: NiveauAlerte;
  description: string;
  photo_url?: string;
}

export type Signalement = SignalementZoneConnue | SignalementZoneInconnue;

// Libelles/couleurs partages entre alerte-card et alerte-detail (DESIGN.md section 5).
export const LABEL_SOURCE_ALERTE: Record<SourceAlerte, string> = {
  auto: 'Detection automatique',
  citoyen: 'Signalement citoyen',
  onacc: 'ONACC officiel',
};

export const BORDURE_PAR_NIVEAU: Record<NiveauAlerte, string> = {
  leger: 'border-l-caution',
  moyen: 'border-l-warning',
  dangereux: 'border-l-danger',
};
