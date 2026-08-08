import { AfterViewInit, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';

import { AlerteService } from '../../core/services/alerte.service';
import { MapsService, LatLngLiteral, StatutItineraire } from '../../core/services/maps.service';
import { Alerte } from '../../core/models';
import { Icon } from '../../shared/components/icon/icon';
import { Navbar } from '../../shared/components/navbar/navbar';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';
import { ItineraireCarte } from './itineraire-carte/itineraire-carte';

// "Ndokotti (score 87)" pour une alerte active, "Bepanda (risque a 17h00)" pour une preventive
// - format de l'exemple des Frontend Specifications v3, Ecran 5.
function libelleZone(alerte: Alerte): string {
  const nom = alerte.nom_quartier ?? 'Zone non identifiee';
  if (alerte.type === 'preventive' && alerte.heure_prevue) {
    const heure = new Date(alerte.heure_prevue).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${nom} (risque a ${heure})`;
  }
  return `${nom} (score ${alerte.score})`;
}

// "A", "A et B", "A, B et C"
function enumerer(alertes: Alerte[]): string {
  const libelles = alertes.map(libelleZone);
  if (libelles.length <= 1) {
    return libelles[0] ?? '';
  }
  return `${libelles.slice(0, -1).join(', ')} et ${libelles[libelles.length - 1]}`;
}

// Ecran 5 - Itineraire sur (Frontend Specifications v3, section 4). Panneau Depart/Destination
// + carte persistante alignes sur la maquette Stitch itin_raire_s_curis.
@Component({
  selector: 'app-itineraire',
  imports: [Navbar, ItineraireCarte, TopAppBar, Icon],
  templateUrl: './itineraire.html',
  styleUrl: './itineraire.css',
})
export class Itineraire implements AfterViewInit {
  private readonly mapsService = inject(MapsService);
  private readonly alerteService = inject(AlerteService);

  private readonly destinationInput = viewChild.required<ElementRef<HTMLInputElement>>('destinationInput');
  private destination: LatLngLiteral | null = null;

  origine = signal<LatLngLiteral | null>(null);
  route = signal<google.maps.DirectionsResult | null>(null);
  zonesAlertees = signal<Alerte[]>([]);
  itineraireCalcule = signal(false);
  enCours = signal(false);

  statut = signal<StatutItineraire>('degage');
  zonesEvitees = signal<Alerte[]>([]);
  zonesTraversees = signal<Alerte[]>([]);

  libelleEvitees = computed(() => enumerer(this.zonesEvitees()));
  libelleTraversees = computed(() => enumerer(this.zonesTraversees()));

  async ngAfterViewInit() {
    try {
      this.origine.set(await this.mapsService.getPositionActuelle());
    } catch {
      // Position refusee : l'utilisateur devra etre gere via une saisie manuelle (non couvert au MVP).
    }

    const autocomplete = await this.mapsService.attacherAutocomplete(this.destinationInput().nativeElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      this.destination = location ? { lat: location.lat(), lng: location.lng() } : null;
    });
  }

  async calculerItineraire() {
    if (!this.origine() || !this.destination) {
      return;
    }
    this.enCours.set(true);
    this.alerteService.getAlertesActives().subscribe(async (alertes) => {
      // Toutes les alertes restent affichees en marqueurs (contexte) ; seul le bandeau
      // ne parle que des zones reellement liees au trajet.
      this.zonesAlertees.set(alertes);

      const resultat = await this.mapsService.calculerItineraire(
        this.origine()!,
        this.destination!,
        alertes,
      );
      this.route.set(resultat.route);
      this.statut.set(resultat.statut);
      this.zonesEvitees.set(resultat.zonesEvitees);
      this.zonesTraversees.set(resultat.zonesTraversees);
      this.itineraireCalcule.set(true);
      this.enCours.set(false);
    });
  }
}
