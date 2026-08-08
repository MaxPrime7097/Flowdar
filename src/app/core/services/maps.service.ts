import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Alerte } from '../models';

const COULEUR_PAR_NIVEAU: Record<Alerte['niveau'], string> = {
  leger: '#CA8A04',
  moyen: '#D97706',
  dangereux: '#DC2626',
};

// Forme "goutte/pin" (meme silhouette que l'icone localisation partagee) plutot qu'un
// simple cercle, pour matcher les marqueurs des maquettes Stitch.
const PIN_PATH = 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z';

let googleMapsLoader: Promise<void> | null = null;

// Charge le script Google Maps JS API une seule fois (JavaScript API + Directions + Places -
// Frontend Specifications v3, section 1).
function loadGoogleMaps(): Promise<void> {
  if (googleMapsLoader) {
    return googleMapsLoader;
  }
  googleMapsLoader = new Promise<void>((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,geometry`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Echec du chargement de Google Maps JS API'));
    document.head.appendChild(script);
  });
  return googleMapsLoader;
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

// Distance en dessous de laquelle on considere que le trajet "passe par" une zone alertee.
export const SEUIL_PROXIMITE_M = 300;

export type StatutItineraire =
  | 'degage' // aucune zone alertee a proximite du trajet
  | 'evite' // des zones existent, l'itineraire retenu les contourne
  | 'traverse'; // meme le meilleur itineraire passe pres d'une zone

export interface ItineraireResultat {
  route: google.maps.DirectionsResult;
  statut: StatutItineraire;
  zonesEvitees: Alerte[]; // proches du trajet par defaut, ecartees grace au reroutage
  zonesTraversees: Alerte[]; // proches du trajet finalement retenu
}

// Decision de securite isolee de l'API Google pour rester testable : c'est elle qui determine
// si l'utilisateur voit un bandeau vert rassurant ou un avertissement rouge.
export function determinerStatut(
  zonesTraversees: Alerte[],
  zonesEvitees: Alerte[],
): StatutItineraire {
  if (zonesTraversees.length > 0) {
    return 'traverse';
  }
  return zonesEvitees.length > 0 ? 'evite' : 'degage';
}

@Injectable({ providedIn: 'root' })
export class MapsService {
  private map: google.maps.Map | null = null;
  private markers: google.maps.Marker[] = [];
  private marqueurPosition: google.maps.Marker | null = null;

  async initialiserCarte(element: HTMLElement, center: LatLngLiteral = { lat: 4.0511, lng: 9.7679 }) {
    await loadGoogleMaps();
    this.map = new google.maps.Map(element, {
      center,
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
    });
    // Les marqueurs de la carte precedente appartiennent a une instance detruite
    // (navigation entre ecrans) : on repart d'un etat propre.
    this.markers = [];
    this.marqueurPosition = null;
    return this.map;
  }

  // Marqueur colore selon le score (jaune/orange/rouge) affichant le score numerique
  ajouterMarqueur(alerte: Alerte, onClick?: (alerte: Alerte) => void): google.maps.Marker | null {
    if (!this.map || alerte.lat === undefined || alerte.lng === undefined) {
      return null;
    }
    const marker = new google.maps.Marker({
      map: this.map,
      position: { lat: alerte.lat, lng: alerte.lng },
      label: {
        text: String(alerte.score),
        color: COULEUR_PAR_NIVEAU[alerte.niveau],
        fontWeight: 'bold',
        fontSize: '13px',
        className: 'marqueur-score-label',
      },
      icon: {
        path: PIN_PATH,
        scale: 1.6,
        fillColor: COULEUR_PAR_NIVEAU[alerte.niveau],
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1.5,
        anchor: new google.maps.Point(12, 22),
        labelOrigin: new google.maps.Point(12, -6),
      },
    });
    if (onClick) {
      marker.addListener('click', () => onClick(alerte));
    }
    this.markers.push(marker);
    return marker;
  }

  supprimerMarqueurs() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  // Marqueur bleu de la position de l'utilisateur (Frontend Specifications v3, Ecran 1).
  // Volontairement hors du tableau `markers` : supprimerMarqueurs() rafraichit les alertes
  // a chaque emission Firestore et ne doit pas faire disparaitre la position au passage.
  afficherPositionActuelle(position: LatLngLiteral): google.maps.Marker | null {
    if (!this.map) {
      return null;
    }
    if (this.marqueurPosition) {
      this.marqueurPosition.setPosition(position);
      return this.marqueurPosition;
    }
    this.marqueurPosition = new google.maps.Marker({
      map: this.map,
      position,
      title: 'Ma position',
      zIndex: 1000, // au-dessus des marqueurs d'alerte
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#1A56DB',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    });
    return this.marqueurPosition;
  }

  // Calcule un itineraire et choisit, parmi les alternatives, celui qui reste le plus loin
  // des zones alertees (evitement approximatif - Google Directions API n'a pas de parametre
  // "avoid zone" natif).
  //
  // Prend les alertes completes et non de simples coordonnees, pour pouvoir dire a
  // l'utilisateur QUELLES zones sont concernees (Frontend Specifications v3, Ecran 5).
  async calculerItineraire(
    origine: LatLngLiteral,
    destination: LatLngLiteral,
    alertes: Alerte[],
  ): Promise<ItineraireResultat> {
    await loadGoogleMaps();
    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: origine,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    });

    const zonesLocalisees = alertes.filter(
      (a): a is Alerte & { lat: number; lng: number } => a.lat !== undefined && a.lng !== undefined,
    );

    if (zonesLocalisees.length === 0) {
      return { route: result, statut: 'degage', zonesEvitees: [], zonesTraversees: [] };
    }

    const distanceZoneRoute = (route: google.maps.DirectionsRoute, zone: LatLngLiteral) => {
      const cible = new google.maps.LatLng(zone.lat, zone.lng);
      let min = Infinity;
      for (const point of route.overview_path) {
        min = Math.min(min, google.maps.geometry.spherical.computeDistanceBetween(point, cible));
      }
      return min;
    };

    const zonesProches = (route: google.maps.DirectionsRoute) =>
      zonesLocalisees.filter((zone) => distanceZoneRoute(route, zone) <= SEUIL_PROXIMITE_M);

    // On retient l'itineraire qui maximise la distance a la zone la plus proche : c'est celui
    // qui repousse le plus loin possible le danger le plus immediat.
    let meilleurIndex = 0;
    let meilleureDistance = -Infinity;
    result.routes.forEach((route, index) => {
      const distance = Math.min(...zonesLocalisees.map((zone) => distanceZoneRoute(route, zone)));
      if (distance > meilleureDistance) {
        meilleureDistance = distance;
        meilleurIndex = index;
      }
    });

    const routeRetenue = result.routes[meilleurIndex];
    const zonesTraversees = zonesProches(routeRetenue);

    // "Evitees" = proches de l'itineraire par defaut de Google mais plus de celui qu'on retient.
    // Si on garde l'itineraire par defaut, cette liste est vide : on n'annonce pas un evitement
    // qui n'a pas eu lieu.
    const zonesEvitees =
      meilleurIndex === 0
        ? []
        : zonesProches(result.routes[0]).filter((zone) => !zonesTraversees.includes(zone));

    return {
      route: { ...result, routes: [routeRetenue] },
      statut: determinerStatut(zonesTraversees, zonesEvitees),
      zonesEvitees,
      zonesTraversees,
    };
  }

  // Champ destination avec autocomplete Google Places (Frontend Specifications v3, Ecran 5)
  async attacherAutocomplete(input: HTMLInputElement): Promise<google.maps.places.Autocomplete> {
    await loadGoogleMaps();
    return new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'cm' },
      fields: ['geometry', 'name'],
    });
  }

  getPositionActuelle(): Promise<LatLngLiteral> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalisation non supportee par ce navigateur'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => reject(error),
      );
    });
  }
}
