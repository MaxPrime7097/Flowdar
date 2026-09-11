import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { MOCK_SCORES } from '../mock-data';
import { ScoreActuel } from '../models';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly http = inject(HttpClient);

  // GET /api/scores - score actuel de toutes les zones (Backend Specifications v3, section 4)
  getScoresActuels(): Observable<ScoreActuel[]> {
    if (environment.useMockData) {
      return of(MOCK_SCORES);
    }
    return this.http.get<ScoreActuel[]>(`${environment.backendUrl}/api/scores`);
  }

  getScoreZone(zoneId: string): Observable<ScoreActuel | undefined> {
    return this.getScoresActuels().pipe(map((scores) => scores.find((s) => s.zone_id === zoneId)));
  }
}
