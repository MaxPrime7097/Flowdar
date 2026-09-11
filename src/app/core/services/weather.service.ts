import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MOCK_METEO_ACTUELLE, MOCK_PREVISIONS, MOCK_PREVISIONS_HORAIRES } from '../mock-data';
import { MeteoActuelle, PrevisionHoraire, PrevisionZone } from '../models';

// Angular ne fait jamais de requete directe a OpenWeatherMap : tout passe par le backend
// (Frontend Specifications v3, section 6).
@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  getMeteoActuelle(): Observable<MeteoActuelle[]> {
    if (environment.useMockData) {
      return of(MOCK_METEO_ACTUELLE);
    }
    return this.http.get<MeteoActuelle[]>(`${environment.backendUrl}/api/meteo/actuelle`);
  }

  getPrevisions(): Observable<PrevisionZone[]> {
    if (environment.useMockData) {
      return of(MOCK_PREVISIONS);
    }
    return this.http.get<PrevisionZone[]>(`${environment.backendUrl}/api/meteo/previsions`);
  }

  // Previsions horaires a l'echelle de la ville (bandeau de l'ecran Prevention).
  // Endpoint confirme par Mr Ebanga mais URL/contrat a figer - voir SETUP.md.
  getPrevisionsHoraires(): Observable<PrevisionHoraire[]> {
    if (environment.useMockData) {
      return of(MOCK_PREVISIONS_HORAIRES);
    }
    return this.http.get<PrevisionHoraire[]>(`${environment.backendUrl}/api/meteo/horaire`);
  }
}
