import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { AlerteService } from '../../core/services/alerte.service';
import { MapsService } from '../../core/services/maps.service';
import { ZoneService } from '../../core/services/zone.service';
import { firebaseStorage } from '../../core/firebase';
import { NiveauAlerte, ZoneARisque } from '../../core/models';
import { Icon } from '../../shared/components/icon/icon';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';
import { StepDetails } from './step-details/step-details';
import { StepRecap } from './step-recap/step-recap';
import { StepZone } from './step-zone/step-zone';

const ETAPES = [
  { numero: 1 as const, label: 'Lieu' },
  { numero: 2 as const, label: 'Details' },
  { numero: 3 as const, label: 'Envoi' },
];

function compresserImage(fichier: File, largeurMax = 1280, qualite = 0.7): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const ratio = Math.min(1, largeurMax / image.width);
      const canvas = document.createElement('canvas');
      canvas.width = image.width * ratio;
      canvas.height = image.height * ratio;
      const contexte = canvas.getContext('2d');
      if (!contexte) {
        reject(new Error('Canvas non supporte'));
        return;
      }
      contexte.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Compression echouee'))), 'image/jpeg', qualite);
    };
    image.onerror = reject;
    image.src = URL.createObjectURL(fichier);
  });
}

// Ecran 4 - Signalement citoyen, formulaire 3 etapes (Frontend Specifications v3, section 2/4)
@Component({
  selector: 'app-signalement',
  imports: [ReactiveFormsModule, StepZone, StepDetails, StepRecap, TopAppBar, Icon],
  templateUrl: './signalement.html',
  styleUrl: './signalement.css',
})
export class Signalement {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly alerteService = inject(AlerteService);
  private readonly zoneService = inject(ZoneService);
  private readonly mapsService = inject(MapsService);

  readonly etapes = ETAPES;
  etapeActuelle = signal<1 | 2 | 3>(1);
  zones = signal<ZoneARisque[]>([]);
  photoFile = signal<File | null>(null);
  envoiEnCours = signal(false);
  envoye = signal(false);
  enFileAttente = signal(false);
  positionPrete = signal(false);

  form = this.fb.nonNullable.group({
    zone: this.fb.nonNullable.group({
      modeZone: this.fb.nonNullable.control<'connue' | 'inconnue'>('connue'),
      zoneId: this.fb.control<string | null>(null),
      lat: this.fb.control<number | null>(null),
      lng: this.fb.control<number | null>(null),
      niveau: this.fb.nonNullable.control<NiveauAlerte>('leger', Validators.required),
    }),
    details: this.fb.nonNullable.group({
      description: this.fb.nonNullable.control('', Validators.required),
    }),
  });

  constructor() {
    this.zoneService.getZonesARisque().subscribe((zones) => this.zones.set(zones));
  }

  async utiliserPositionActuelle() {
    try {
      const position = await this.mapsService.getPositionActuelle();
      this.form.controls.zone.patchValue({ lat: position.lat, lng: position.lng, zoneId: null });
      this.positionPrete.set(true);
    } catch {
      // Geolocalisation refusee : l'utilisateur devra choisir un quartier connu a la place.
    }
  }

  suivant() {
    this.etapeActuelle.update((etape) => (etape < 3 ? ((etape + 1) as 1 | 2 | 3) : etape));
  }

  precedent() {
    this.etapeActuelle.update((etape) => (etape > 1 ? ((etape - 1) as 1 | 2 | 3) : etape));
  }

  get zoneInconnue() {
    return this.form.controls.zone.controls.modeZone.value === 'inconnue';
  }

  async envoyer() {
    this.envoiEnCours.set(true);
    const zoneValue = this.form.controls.zone.getRawValue();
    const detailsValue = this.form.controls.details.getRawValue();

    let photoUrl: string | undefined;
    const fichier = this.photoFile();
    if (fichier && navigator.onLine) {
      try {
        const blobCompresse = await compresserImage(fichier);
        const chemin = `signalements/${Date.now()}-${fichier.name}`;
        const storageRef = ref(firebaseStorage, chemin);
        await uploadBytes(storageRef, blobCompresse);
        photoUrl = await getDownloadURL(storageRef);
      } catch {
        // Upload de la photo echoue (reseau coupe en cours d'envoi) : le signalement texte
        // part quand meme, sans photo (mise en file d'attente si necessaire par signalerZone).
      }
    }

    const signalement =
      zoneValue.modeZone === 'connue'
        ? {
            zone_id: zoneValue.zoneId!,
            niveau: zoneValue.niveau,
            description: detailsValue.description,
            photo_url: photoUrl,
          }
        : {
            lat: zoneValue.lat!,
            lng: zoneValue.lng!,
            niveau: zoneValue.niveau,
            description: detailsValue.description,
            photo_url: photoUrl,
          };

    this.alerteService.signalerZone(signalement).subscribe({
      next: ({ enFileAttente }) => {
        this.envoiEnCours.set(false);
        this.envoye.set(true);
        this.enFileAttente.set(enFileAttente);
      },
      error: () => {
        this.envoiEnCours.set(false);
      },
    });
  }

  retourCarte() {
    this.router.navigateByUrl('/');
  }
}
