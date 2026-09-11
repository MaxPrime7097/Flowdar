import { Component, input } from '@angular/core';

import { Confirmation } from '../../../core/models';
import { TempsEcoulePipe } from '../../../shared/pipes/temps-ecoule.pipe';

// Liste des confirmations avec horodatage (Frontend Specifications v3, section 4 - Ecran 2)
@Component({
  selector: 'app-confirmation-list',
  imports: [TempsEcoulePipe],
  templateUrl: './confirmation-list.html',
  styleUrl: './confirmation-list.css',
})
export class ConfirmationList {
  confirmations = input.required<Confirmation[]>();
}
