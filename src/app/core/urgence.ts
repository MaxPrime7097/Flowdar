// Numeros d'urgence camerounais - SOURCE UNIQUE de l'application.
//
// ATTENTION : ces numeros sont utilises pendant une urgence reelle. Ne les modifier qu'apres
// verification aupres d'une source officielle (voir SETUP.md, section "Numeros d'urgence").
//
// Depuis un mobile, les numeros courts sont prefixes d'un 1 (17 -> 117, 18 -> 118...).
// L'app cible des smartphones : on utilise donc les formes mobiles.
//
// A NOTER : l'ONACC (source de donnees des alertes) est un observatoire climatique, PAS un
// service de secours. Ne jamais y router un appel d'urgence.

export interface ServiceUrgence {
  nom: string;
  numero: string;
  description: string;
  // Service a appeler en priorite pour une inondation (sauvetage de personnes).
  principal: boolean;
}

export const SERVICES_URGENCE: ServiceUrgence[] = [
  {
    nom: 'Sapeurs-pompiers',
    numero: '118',
    description: 'Personne bloquée par l\'eau, sauvetage, evacuation',
    principal: true,
  },
  {
    nom: 'SAMU',
    numero: '119',
    description: 'Blessé, malaise, urgence médicale',
    principal: false,
  },
  {
    nom: 'Police',
    numero: '117',
    description: 'Route coupée, accident, securité des personnes',
    principal: false,
  },
];

// Numero d'urgence GSM international : fonctionne meme sans credit ni carte SIM active.
export const NUMERO_URGENCE_UNIVERSEL = '112';
