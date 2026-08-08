import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MOCK_ZONES } from '../mock-data';
import { ZoneARisque } from '../models';

// Pas documente comme service dedie dans Frontend Specifications v3 (section 5), mais
// GET /api/zones-a-risque est utilise par plusieurs ecrans (carte, signalement, itineraire,
// historique) : centralise ici plutot que duplique dans chaque composant.
@Injectable({ providedIn: 'root' })
export class ZoneService {
  private readonly http = inject(HttpClient);

  // partage/cache la reponse : la liste des quartiers connus change rarement pendant une session
  private readonly zones$ = (
    environment.useMockData
      ? of(MOCK_ZONES)
      : this.http.get<ZoneARisque[]>(`${environment.backendUrl}/api/zones-a-risque`)
  ).pipe(shareReplay({ bufferSize: 1, refCount: false }));

  getZonesARisque(): Observable<ZoneARisque[]> {
    return this.zones$;
  }

  getZoneById(zoneId: string): Observable<ZoneARisque | undefined> {
    return this.zones$.pipe(map((zones) => zones.find((z) => z.id === zoneId)));
  }
}
