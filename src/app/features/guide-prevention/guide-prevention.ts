import { Component, signal } from '@angular/core';

import { SERVICES_URGENCE } from '../../core/urgence';
import { Icon, NomIcone } from '../../shared/components/icon/icon';
import { Navbar } from '../../shared/components/navbar/navbar';
import { SosSheet } from '../../shared/components/sos-sheet/sos-sheet';
import { TopAppBar } from '../../shared/components/top-app-bar/top-app-bar';

interface Consigne {
  texte: string;
  // Consigne vitale : mise en avant visuellement (fond rouge) pour etre lisible en un coup d'oeil.
  critique?: boolean;
}

interface SectionGuide {
  id: string;
  titre: string;
  sousTitre: string;
  icone: NomIcone;
  couleur: string;
  consignes: Consigne[];
}

// Consignes basees sur les recommandations standard de securite inondation (Croix-Rouge / OMS),
// adaptees au contexte de Douala : caniveaux obstrues par les dechets, forte presence de
// moto-taxis, risque de maladies hydriques apres immersion.
const SECTIONS: SectionGuide[] = [
  {
    id: 'avant',
    titre: 'Avant',
    sousTitre: 'Se préparer quand une alerte est annoncée',
    icone: 'bouclier',
    couleur: 'bg-primary',
    consignes: [
      { texte: 'Dégagez les caniveaux et rigoles devant chez vous : les déchets qui les bouchent sont la première cause de débordement en ville.' },
      { texte: 'Préparez un sac : eau potable, médicaments en cours, lampe torche, batterie externe chargée, argent liquide.' },
      { texte: 'Mettez papiers d\'identité, actes et diplômes dans un sachet plastique bien fermé, en hauteur.' },
      { texte: 'Surélevez ce qui craint l\'eau : matelas, appareils électriques, provisions, documents.' },
      { texte: 'Repérez à l\'avance le point haut le plus proche (étage, terrain surlevé) et le chemin pour y aller.' },
      { texte: 'Enregistrez les numéros de secours dans votre téléphone maintenant, pas pendant l\'urgence.' },
    ],
  },
  {
    id: 'pendant',
    titre: 'Pendant',
    sousTitre: 'L\'eau monte : les réflexes qui sauvent',
    icone: 'goutte',
    couleur: 'bg-danger',
    consignes: [
      { texte: 'Ne traversez JAMAIS une eau en mouvement, même basse : 15 cm suffisent à vous faire perdre l\'équilibre.', critique: true },
      { texte: 'Ne traversez pas en voiture ni en moto-taxi : 60 cm d\'eau emportent la plupart des véhicules, et vous ne voyez pas si la route ou un caniveau s\'est effondré dessous.', critique: true },
      { texte: 'Coupez l\'electricité au disjoncteur AVANT que l\'eau n\'atteigne les prises. Ne touchez à rien d\'électrique les pieds dans l\'eau.', critique: true },
      { texte: 'Montez en hauteur, mais jamais dans un espace fermé sans issue vers l\'extérieur.' },
      { texte: 'Ne buvez pas et ne vous baignez pas dans l\'eau d\'inondation : elle est mélangée aux eaux usées.' },
      { texte: 'Appelez le 118 (sapeurs-pompiers) si une personne est bloquée. Donnez le quartier et un point de repère précis.' },
      { texte: 'Éloignez-vous des câbles électriques tombés et prévenez les autres autour de vous.' },
    ],
  },
  {
    id: 'apres',
    titre: 'Apres',
    sousTitre: 'L\'eau se retire : éviter les maladies',
    icone: 'trousse',
    couleur: 'bg-success',
    consignes: [
      { texte: 'Faites bouillir l\'eau de boisson au moins 1 minute, ou traitez-la, tant que le réseau n\'est pas déclaré sain.' },
      { texte: 'Lavez-vous au savon et à l\'eau propre après tout contact avec l\'eau d\'inondation.' },
      { texte: 'Consultez rapidement en cas de fièvre, diarrée ou vomissements : le risque de choléra et de typhoïde augmente après une inondation.', critique: true },
      { texte: 'Ne remettez pas le courant avant qu\'un électricien ait vérifié l\'installation immergée.' },
      { texte: 'Videz les eaux stagnantes (seaux, pneus, bidons) : elles deviennent des gîtes à moustiques en quelques jours.' },
      { texte: 'Nettoyez et désinfectez les surfaces et ustensiles touchés par l\'eau.' },
      { texte: 'Signalez la zone dans Flowdar : votre signalement prévient vos voisins et alimente la carte en temps réel.' },
    ],
  },
];

// Guide de prevention - ecran cible du bouton "Guide de prevention" de l'ecran Prevention.
// Non specifie dans le Cahier des Charges v3 : contenu redige a partir des recommandations
// standard inondation, adapte au contexte de Douala.
@Component({
  selector: 'app-guide-prevention',
  imports: [TopAppBar, Icon, Navbar, SosSheet],
  templateUrl: './guide-prevention.html',
  styleUrl: './guide-prevention.css',
})
export class GuidePrevention {
  readonly sections = SECTIONS;
  readonly services = SERVICES_URGENCE;

  sosOuvert = signal(false);
}
