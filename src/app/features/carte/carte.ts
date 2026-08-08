import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, combineLatest, fromEvent, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AlerteService } from '../../core/services/alerte.service';
import { MapsService } from '../../core/services/maps.service';
import { PushService } from '../../core/services/push.service';
import { ScoreService } from '../../core/services/score.service';
import { WeatherService } from '../../core/services/weather.service';
import { ZoneService } from '../../core/services/zone.service';
import { Alerte } from '../../core/models';
import { Navbar } from '../../shared/components/navbar/navbar';
import { MeteoBandeau } from '../../shared/components/meteo-bandeau/meteo-bandeau';
import { Icon } from '../../shared/components/icon/icon';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { CarteMarqueur } from './carte-marqueur/carte-marqueur';
import { CarteBottomsheet } from './carte-bottomsheet/carte-bottomsheet';

function distanceMetres(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Ecran 1 - Carte principale (Frontend Specifications v3, section 4 ; barre de recherche
// et toast de risque proactif ajoutes pour matcher la maquette Stitch flowdar_carte_en_temps_r_el)
@Component({
  selector: 'app-carte',
  imports: [RouterLink, Navbar, MeteoBandeau, Icon, Skeleton, CarteMarqueur, CarteBottomsheet],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte implements AfterViewInit, OnDestroy {
  private readonly alerteService = inject(AlerteService);
  private readonly zoneService = inject(ZoneService);
  private readonly weatherService = inject(WeatherService);
  private readonly mapsService = inject(MapsService);
  private readonly pushService = inject(PushService);
  private readonly scoreService = inject(ScoreService);

  readonly nonLues = this.pushService.nonLues;

  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');
  private readonly rechercheInput = viewChild<ElementRef<HTMLInputElement>>('rechercheInput');
  private subscription?: Subscription;

  alertes = signal<Alerte[]>([]);
  chargement = signal(true);
  alerteSelectionnee = signal<Alerte | null>(null);
  horsLigne = signal(!navigator.onLine);
  derniereMaj = signal<string | null>(null);
  meteoQuartierProche = signal<{ nom: string; pluieMmH: number } | null>(null);
  toastFerme = signal(false);

  // Toast proactif "Risque eleve detecte" (maquette Stitch) : l'alerte la plus severe en cours
  alerteCritique = computed(() => {
    if (this.toastFerme()) {
      return null;
    }
    const dangereuses = this.alertes().filter((a) => a.niveau === 'dangereux');
    if (dangereuses.length === 0) {
      return null;
    }
    return dangereuses.reduce((pire, a) => (a.score > pire.score ? a : pire));
  });

  async ngAfterViewInit() {
    const carte = await this.mapsService.initialiserCarte(this.mapContainer().nativeElement);

    const rechercheEl = this.rechercheInput()?.nativeElement;
    if (rechercheEl) {
      const autocomplete = await this.mapsService.attacherAutocomplete(rechercheEl);
      autocomplete.addListener('place_changed', () => {
        const location = autocomplete.getPlace().geometry?.location;
        if (location) {
          carte.panTo(location);
          carte.setZoom(15);
        }
      });
    }

    const statutReseau$ = merge(fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(
      startWith(null),
      map(() => navigator.onLine),
    );

    this.subscription = combineLatest([
      this.alerteService.getAlertesActives(),
      this.zoneService.getZonesARisque(),
      this.scoreService.getScoresActuels(),
      statutReseau$,
    ]).subscribe(([alertes, zones, scores, enLigne]) => {
      const alertesEnrichies = alertes.map((alerte) => {
        const zone = zones.find((z) => z.id === alerte.zone_id);
        // GET /api/scores fait autorite sur le score affiche sur le marqueur : il est
        // recalcule plus souvent que le document d'alerte (checklist v3, section 9 item 6).
        const scoreActuel = scores.find((s) => s.zone_id === alerte.zone_id);
        return {
          ...alerte,
          score: scoreActuel?.score ?? alerte.score,
          niveau: scoreActuel?.niveau ?? alerte.niveau,
          nom_quartier: alerte.nom_quartier ?? zone?.nom_quartier,
          lat: alerte.lat ?? zone?.lat,
          lng: alerte.lng ?? zone?.lng,
        };
      });
      this.alertes.set(alertesEnrichies);
      this.chargement.set(false);
      this.horsLigne.set(!enLigne);
      if (enLigne) {
        this.derniereMaj.set(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
      }

      this.mapsService.supprimerMarqueurs();
      for (const alerte of alertesEnrichies) {
        this.mapsService.ajouterMarqueur(alerte, (a) => this.alerteSelectionnee.set(a));
      }
    });

    this.chargerMeteoQuartierProche();
  }

  private chargerMeteoQuartierProche() {
    combineLatest([this.weatherService.getMeteoActuelle(), this.zoneService.getZonesARisque()]).subscribe(
      async ([meteos, zones]) => {
        if (zones.length === 0) {
          return;
        }
        let quartierRef = zones[0];
        try {
          const position = await this.mapsService.getPositionActuelle();
          // Marqueur bleu de la position actuelle (Frontend Specifications v3, Ecran 1)
          this.mapsService.afficherPositionActuelle(position);
          quartierRef = zones.reduce((plusProche, zone) =>
            distanceMetres(position, zone) < distanceMetres(position, plusProche) ? zone : plusProche,
          );
        } catch {
          // Geolocalisation refusee ou indisponible : on garde le premier quartier par defaut.
        }
        const meteo = meteos.find((m) => m.zone_id === quartierRef.id);
        if (meteo) {
          this.meteoQuartierProche.set({ nom: quartierRef.nom_quartier, pluieMmH: meteo.pluie_mm_h });
        }
      },
    );
  }

  fermerBottomSheet() {
    this.alerteSelectionnee.set(null);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
