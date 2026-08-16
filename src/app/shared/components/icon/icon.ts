import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

const ICONES: Record<string, string> = {
  'carte': 'lucideMap',
  'preventives': 'lucideShield',
  'itineraire': 'lucideNavigation',
  'historique': 'lucideClock',
  'profil': 'lucideUser',
  'danger': 'lucideTriangleAlert',
  'warning': 'lucideTriangleAlert',
  'caution': 'lucideOctagonAlert',
  'alerte-leger': 'lucideCircleAlert',
  'alerte-moyen': 'lucideTriangleAlert',
  'alerte-dangereux': 'lucideOctagonAlert',
  'info': 'lucideInfo',
  'fermer': 'lucideX',
  'plus': 'lucidePlus',
  'check': 'lucideCircleCheck',
  'inonde': 'lucideWavesHorizontal',
  'cloche': 'lucideBell',
  'retour': 'lucideArrowLeft',
  'recherche': 'lucideSearch',
  'localisation': 'lucideMapPin',
  'mail': 'lucideMail',
  'cadenas': 'lucideLock',
  'oeil': 'lucideEye',
  'envoyer': 'lucideSend',
  'appareil-photo': 'lucideCamera',
  'calques': 'lucideLayers',
  'cibler': 'lucideLocate',
  'sos': 'lucideSiren',
  'utilisateurs': 'lucideUsers',
  'horloge': 'lucideClock',
  'chevron-droite': 'lucideChevronRight',
  'chevron-gauche': 'lucideChevronLeft',
  'chevron-bas': 'lucideChevronDown',
  'filtre': 'lucideFilter',
  'bouclier': 'lucideShield',
  'tendance': 'lucideTrendingUp',
  'voiture': 'lucideRoute',
  'pluie': 'lucideCloudRain',
  'nuage': 'lucideCloud',
  'orage': 'lucideCloudLightning',
  'telephone': 'lucidePhone',
  'goutte': 'lucideDroplets',
  'eclair': 'lucideZap',
  'trousse': 'lucideBriefcaseMedical',
  'robot': 'lucideBot',
  'megaphone': 'lucideMegaphone',
  'satellite': 'lucideSatellite',
  'smartphone': 'lucideSmartphone',
  'wifi': 'lucideWifi',
  'activite': 'lucideActivity',
  'trophee': 'lucideAward',
  'check-circle': 'lucideCheckCircle2',
  'sablier': 'lucideHourglass',
  'success': 'lucideCheckCircle',
};

export type NomIcone = keyof typeof ICONES;

@Component({
  selector: 'app-icon',
  imports: [NgIcon],
  template: `<ng-icon [name]="icone()" [size]="taille().toString()" [strokeWidth]="epaisseur()" />`,
  host: { class: 'inline-flex items-center justify-center' },
})
export class Icon {
  nom = input.required<NomIcone>();
  taille = input(22);
  epaisseur = input(1.5);
  icone = () => ICONES[this.nom()] ?? 'lucideCircle';
}
