import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PushService } from '../../../core/services/push.service';
import { Icon } from '../icon/icon';

// En-tete standard des ecrans secondaires : retour + titre + cloche (maquettes Stitch,
// ex: signaler_une_inondation, historique_des_alertes, itin_raire_s_curis).
@Component({
  selector: 'app-top-app-bar',
  imports: [Icon, RouterLink],
  templateUrl: './top-app-bar.html',
  styles: ``,
})
export class TopAppBar {
  private readonly location = inject(Location);
  private readonly pushService = inject(PushService);

  titre = input.required<string>();

  readonly nonLues = this.pushService.nonLues;

  retour() {
    this.location.back();
  }
}
