import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { AlerteService } from '../../core/services/alerte.service';
import { WeatherService } from '../../core/services/weather.service';
import { ZoneService } from '../../core/services/zone.service';
import { NiveauAlerte, PrevisionHoraire } from '../../core/models';
import { BadgeNiveau } from '../../shared/components/badge-niveau/badge-niveau';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Icon, NomIcone } from '../../shared/components/icon/icon';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';

interface PrevisionAffichee {
  // Present uniquement pour les alertes preventives reelles (/api/alertes?type=preventive) :
  // permet d'ouvrir le detail. Les previsions brutes (/api/meteo/previsions) n'ont pas d'id.
  alerteId: string | null;
  nomQuartier: string;
  heurePrevue: string;
  score: number;
  niveau: NiveauAlerte;
}

interface HeureAffichee {
  heure: string;
  icone: NomIcone;
  mm: number;
  severe: boolean;
}

// Seuil "pluie forte" au-dela duquel la carte horaire est mise en avant (mise en forme
// uniquement - le score de risque reste calcule par le backend).
const SEUIL_PLUIE_SEVERE_MM = 20;

// L'ecran ne montre que les zones a risque "dans les 6 prochaines heures"
// (Frontend Specifications v3, section 4 - Ecran 3).
const FENETRE_PREVISION_H = 6;

function niveauDePrevision(score: number): NiveauAlerte {
  // Une alerte preventive ne peut jamais etre "dangereux" (CDC v3, section 8/9)
  return score >= 60 ? 'moyen' : 'leger';
}

function iconeMeteo(pluieMmH: number): NomIcone {
  if (pluieMmH >= SEUIL_PLUIE_SEVERE_MM) return 'orage';
  if (pluieMmH >= 3) return 'pluie';
  return 'nuage';
}

const COULEUR_NIVEAU: Record<NiveauAlerte, { fond: string; texte: string }> = {
  leger: { fond: 'bg-caution', texte: 'text-caution' },
  moyen: { fond: 'bg-warning', texte: 'text-warning' },
  dangereux: { fond: 'bg-danger', texte: 'text-danger' },
};

// Ecran 3 - Alertes preventives. Alimente par DEUX sources (confirme avec Mr Ebanga) :
// - GET /api/alertes?type=preventive : alertes preventives reelles (cliquables vers le detail)
// - GET /api/meteo/previsions        : scores previsionnels bruts des zones sans alerte ouverte
// En cas de doublon sur une meme zone, l'alerte reelle gagne (elle porte un id consultable).
// Le bandeau horaire vient de GET /api/meteo/horaire.
@Component({
  selector: 'app-alertes-preventives',
  imports: [Navbar, DatePipe, BadgeNiveau, EmptyState, Skeleton, TopAppBar, Icon, RouterLink],
  templateUrl: './alertes-preventives.html',
  styleUrl: './alertes-preventives.css',
})
export class AlertesPreventives {
  private readonly weatherService = inject(WeatherService);
  private readonly alerteService = inject(AlerteService);
  private readonly zoneService = inject(ZoneService);

  private readonly previsionsBrutes = signal<PrevisionAffichee[]>([]);
  private readonly heuresBrutes = signal<PrevisionHoraire[]>([]);
  chargement = signal(true);

  previsions = computed(() =>
    [...this.previsionsBrutes()].sort((a, b) => a.heurePrevue.localeCompare(b.heurePrevue)),
  );

  bandeauMeteo = computed<HeureAffichee[]>(() =>
    this.heuresBrutes().map((prevision) => ({
      heure: new Date(prevision.heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      icone: iconeMeteo(prevision.pluie_mm_h),
      mm: prevision.pluie_mm_h,
      severe: prevision.pluie_mm_h >= SEUIL_PLUIE_SEVERE_MM,
    })),
  );

  constructor() {
    combineLatest([
      this.weatherService.getPrevisions(),
      this.alerteService.getAlertesPreventives(),
      this.zoneService.getZonesARisque(),
    ]).subscribe(([previsions, alertes, zones]) => {
      const nomDeZone = (zoneId: string) =>
        zones.find((z) => z.id === zoneId)?.nom_quartier ?? zoneId;

      const limite = Date.now() + FENETRE_PREVISION_H * 3600_000;
      // Une echeance deja passee reste affichee (le risque est en cours) ; seules les
      // previsions au-dela de la fenetre de 6 h sont ecartees.
      const dansLaFenetre = (heure: string) => new Date(heure).getTime() <= limite;

      // Les alertes preventives reelles priment sur les previsions brutes de la meme zone.
      const parZone = new Map<string, PrevisionAffichee>();

      for (const alerte of alertes) {
        const echeance = alerte.heure_prevue ?? alerte.heure_debut;
        if (!dansLaFenetre(echeance)) {
          continue;
        }
        parZone.set(alerte.zone_id, {
          alerteId: alerte.id,
          nomQuartier: alerte.nom_quartier ?? nomDeZone(alerte.zone_id),
          heurePrevue: alerte.heure_prevue ?? alerte.heure_debut,
          score: alerte.score,
          niveau: alerte.niveau,
        });
      }

      for (const prevision of previsions) {
        if (
          prevision.score_previsionnel <= 30 ||
          parZone.has(prevision.zone_id) ||
          !dansLaFenetre(prevision.heure_prevue)
        ) {
          continue;
        }
        parZone.set(prevision.zone_id, {
          alerteId: null,
          nomQuartier: nomDeZone(prevision.zone_id),
          heurePrevue: prevision.heure_prevue,
          score: prevision.score_previsionnel,
          niveau: niveauDePrevision(prevision.score_previsionnel),
        });
      }

      this.previsionsBrutes.set([...parZone.values()]);
      this.chargement.set(false);
    });

    this.weatherService.getPrevisionsHoraires().subscribe((heures) => this.heuresBrutes.set(heures));
  }

  couleurNiveau(niveau: NiveauAlerte) {
    return COULEUR_NIVEAU[niveau];
  }
}
