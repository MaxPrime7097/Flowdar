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
    sousTitre: 'Se preparer quand une alerte est annoncee',
    icone: 'bouclier',
    couleur: 'bg-primary',
    consignes: [
      { texte: 'Degagez les caniveaux et rigoles devant chez vous : les dechets qui les bouchent sont la premiere cause de debordement en ville.' },
      { texte: 'Preparez un sac : eau potable, medicaments en cours, lampe torche, batterie externe chargee, argent liquide.' },
      { texte: 'Mettez papiers d\'identite, actes et diplomes dans un sachet plastique bien ferme, en hauteur.' },
      { texte: 'Surelevez ce qui craint l\'eau : matelas, appareils electriques, provisions, documents.' },
      { texte: 'Reperez a l\'avance le point haut le plus proche (etage, terrain surleve) et le chemin pour y aller.' },
      { texte: 'Enregistrez les numeros de secours dans votre telephone maintenant, pas pendant l\'urgence.' },
    ],
  },
  {
    id: 'pendant',
    titre: 'Pendant',
    sousTitre: 'L\'eau monte : les reflexes qui sauvent',
    icone: 'goutte',
    couleur: 'bg-danger',
    consignes: [
      { texte: 'Ne traversez JAMAIS une eau en mouvement, meme basse : 15 cm suffisent a vous faire perdre l\'equilibre.', critique: true },
      { texte: 'Ne traversez pas en voiture ni en moto-taxi : 60 cm d\'eau emportent la plupart des vehicules, et vous ne voyez pas si la route ou un caniveau s\'est effondre dessous.', critique: true },
      { texte: 'Coupez l\'electricite au disjoncteur AVANT que l\'eau n\'atteigne les prises. Ne touchez a rien d\'electrique les pieds dans l\'eau.', critique: true },
      { texte: 'Montez en hauteur, mais jamais dans un espace ferme sans issue vers l\'exterieur.' },
      { texte: 'Ne buvez pas et ne vous baignez pas dans l\'eau d\'inondation : elle est melangee aux eaux usees.' },
      { texte: 'Appelez le 118 (sapeurs-pompiers) si une personne est bloquee. Donnez le quartier et un point de repere precis.' },
      { texte: 'Eloignez-vous des cables electriques tombes et prevenez les autres autour de vous.' },
    ],
  },
  {
    id: 'apres',
    titre: 'Apres',
    sousTitre: 'L\'eau se retire : eviter les maladies',
    icone: 'trousse',
    couleur: 'bg-success',
    consignes: [
      { texte: 'Faites bouillir l\'eau de boisson au moins 1 minute, ou traitez-la, tant que le reseau n\'est pas declare sain.' },
      { texte: 'Lavez-vous au savon et a l\'eau propre apres tout contact avec l\'eau d\'inondation.' },
      { texte: 'Consultez rapidement en cas de fievre, diarrhee ou vomissements : le risque de cholera et de typhoide augmente apres une inondation.', critique: true },
      { texte: 'Ne remettez pas le courant avant qu\'un electricien ait verifie l\'installation immergee.' },
      { texte: 'Videz les eaux stagnantes (seaux, pneus, bidons) : elles deviennent des gites a moustiques en quelques jours.' },
      { texte: 'Nettoyez et desinfectez les surfaces et ustensiles touches par l\'eau.' },
      { texte: 'Signalez la zone dans Flowdar : votre signalement previent vos voisins et alimente la carte en temps reel.' },
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
