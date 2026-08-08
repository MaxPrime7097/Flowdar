import { AfterViewInit, Component, ElementRef, effect, inject, input, viewChild } from '@angular/core';

import { LatLngLiteral, MapsService } from '../../../core/services/maps.service';
import { Alerte } from '../../../core/models';
import { Icon } from '../../../shared/components/icon/icon';

// Carte avec itineraire trace en bleu, zones alertees en rouge (Frontend Specifications v3, Ecran 5).
// Persistante des l'arrivee sur l'ecran (pas seulement apres calcul) pour matcher la maquette
// Stitch itin_raire_s_curis, avec boutons flottants calques (visuel) + recentrage GPS (reel).
@Component({
  selector: 'app-itineraire-carte',
  imports: [Icon],
  templateUrl: './itineraire-carte.html',
  styleUrl: './itineraire-carte.css',
})
export class ItineraireCarte implements AfterViewInit {
  private readonly mapsService = inject(MapsService);
  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  route = input<google.maps.DirectionsResult | null>(null);
  zonesAlertees = input<Alerte[]>([]);
  origine = input<LatLngLiteral | null>(null);

  private map: google.maps.Map | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;

  constructor() {
    effect(() => {
      const route = this.route();
      if (this.directionsRenderer && route) {
        this.directionsRenderer.setDirections(route);
      }
    });

    effect(() => {
      const zones = this.zonesAlertees();
      if (!this.map) {
        return;
      }
      this.mapsService.supprimerMarqueurs();
      for (const zone of zones) {
        this.mapsService.ajouterMarqueur(zone);
      }
    });

    effect(() => {
      const origine = this.origine();
      if (this.map && origine) {
        this.map.panTo(origine);
        this.map.setZoom(14);
      }
    });
  }

  async ngAfterViewInit() {
    this.map = await this.mapsService.initialiserCarte(
      this.mapContainer().nativeElement,
      this.origine() ?? undefined,
    );
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });
  }

  recentrer() {
    const origine = this.origine();
    if (this.map && origine) {
      this.map.panTo(origine);
      this.map.setZoom(14);
    }
  }
}
