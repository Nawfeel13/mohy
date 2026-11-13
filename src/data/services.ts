export type IconName =
  'windshield' | 'car' | 'adas' | 'impact' | 'tint' | 'van' | 'shield' | 'gift' | 'clock' | 'phone';

export interface Faq {
  q: string;
  a: string;
}

export interface Block {
  title: string;
  body?: string[];
  list?: string[];
}

export interface Service {
  slug: string;
  icon: IconName;
  /** Libellé court (menu, cartes) */
  label: string;
  /** H1 de la page */
  h1: string;
  /** Meta title sans le nom de la marque */
  metaTitle: string;
  metaDescription: string;
  /** Une ligne pour la liste des services sur l'accueil */
  teaser: string;
  /** Chapô de la page */
  lead: string;
  /** Points clés affichés à côté du chapô */
  facts: { k: string; v: string }[];
  blocks: Block[];
  faq: Faq[];
}

export const services: Service[] = [
  {
    slug: 'remplacement-pare-brise',
    icon: 'windshield',
    label: 'Remplacement de pare-brise',
    h1: 'Remplacement de pare-brise',
    metaTitle: 'Remplacement de pare-brise, franchise offerte',
    metaDescription:
      'Pare-brise fissuré ? Remplacement toutes marques en atelier ou à domicile, démarches assurance prises en charge, franchise ou 150 € offerts. Appelez le 06 98 62 13 12.',
    teaser:
      'Toutes marques, vitrage de qualité équivalente à l’origine, démarches assurance incluses.',
    lead: 'Une fissure ne se répare pas : elle progresse avec les vibrations et les écarts de température, et elle vaut une contre-visite au contrôle technique. On remplace votre pare-brise à l’atelier ou là où est garée la voiture, et on traite directement avec votre assureur.',
    facts: [
      { k: 'Durée sur place', v: '1 h 30 à 2 h' },
      { k: 'Avant de reprendre la route', v: '1 h de séchage' },
      { k: 'Assurance', v: 'Toutes compagnies' },
    ],
    blocks: [
      {
        title: 'Quand faut-il remplacer plutôt que réparer ?',
        list: [
          'Une fissure, même courte : elle ne se stabilise pas.',
          'Un impact plus large qu’une pièce de 2 €.',
          'Un impact dans le champ de vision du conducteur (la bande de 30 cm face au volant).',
          'Un impact à moins de 5 cm du bord du pare-brise.',
          'Plusieurs impacts, ou un pare-brise rayé par les essuie-glaces au point de gêner la nuit.',
        ],
      },
      {
        title: 'Comment se passe l’intervention',
        list: [
          'On relève votre immatriculation pour commander la référence exacte : capteur de pluie, caméra, chauffant, acoustique, affichage tête haute.',
          'Dépose des enjoliveurs, des balais et de l’ancien pare-brise, sans abîmer la carrosserie.',
          'Préparation du cadre, primaire anticorrosion puis cordon de colle polyuréthane.',
          'Pose du vitrage neuf, remontage des capteurs et des garnitures, contrôle de l’étanchéité.',
          'Si le véhicule a une caméra d’aide à la conduite : calibrage ADAS avant restitution.',
        ],
      },
      {
        title: 'Assurance : ce que vous avez à faire',
        body: [
          'Presque rien. Si votre contrat comprend la garantie bris de glace, apportez votre carte verte ou le nom de votre assureur et votre numéro de contrat. On déclare le sinistre, on envoie la facture et les photos à votre compagnie.',
          'Depuis la loi Hamon de 2014, vous êtes libre de choisir votre réparateur, même s’il n’est pas dans le réseau agréé de votre assureur. Personne ne peut vous imposer un autre centre.',
        ],
      },
    ],
    faq: [
      {
        q: 'Est-ce que je peux rouler juste après ?',
        a: 'Comptez une heure de séchage de la colle avant de reprendre le volant. Évitez ensuite les stations de lavage à rouleaux pendant 48 h et laissez une vitre très légèrement entrouverte la première nuit si possible.',
      },
      {
        q: 'Ma franchise est de 150 € ou moins, je paie quelque chose ?',
        a: "Dans le cadre de notre offre, la franchise bris de glace est prise en charge par l'atelier jusqu'à 150 €. Si votre franchise est plus élevée, la différence reste à votre charge ; si vous n'en avez pas, les 150 € vous sont offerts sous une autre forme. Les conditions exactes vous sont données avant l'intervention.",
      },
      {
        q: 'Vous posez des pare-brise d’origine ?',
        a: 'Nous posons du vitrage d’origine constructeur ou de qualité équivalente, homologué et marqué E. Le choix vous est présenté avant la commande.',
      },
    ],
  },
  {
    slug: 'reparation-impact',
    icon: 'impact',
    label: 'Réparation d’impact',
    h1: 'Réparation d’impact de pare-brise',
    metaTitle: 'Réparation d’impact de pare-brise en 30 minutes',
    metaDescription:
      "Un gravillon a touché votre pare-brise ? Réparation d'impact par injection de résine en 30 minutes, souvent sans franchise. Intervention à l'atelier ou à domicile.",
    teaser: 'Injection de résine en 30 minutes, avant que l’éclat ne devienne une fissure.',
    lead: 'Un éclat de la taille d’une pièce de 2 € se répare. Le lendemain d’une nuit de gel ou d’un coup de chauffage, il peut devenir une fissure de 20 cm. Plus tôt on intervient, plus la réparation est propre.',
    facts: [
      { k: 'Durée', v: 'Environ 30 min' },
      { k: 'Taille maximum', v: 'Une pièce de 2 €' },
      { k: 'Franchise', v: 'Rarement appliquée' },
    ],
    blocks: [
      {
        title: 'Ce qu’on peut réparer',
        list: [
          'Impact plus petit qu’une pièce de 2 € (environ 2,5 cm).',
          'Hors de la zone de vision directe du conducteur.',
          'À plus de 5 cm du bord du pare-brise.',
          'Pas de fissure qui part de l’impact.',
        ],
      },
      {
        title: 'En attendant le rendez-vous',
        list: [
          'Collez un morceau de ruban adhésif transparent sur l’impact : il évite que la poussière et l’humidité y entrent.',
          'Évitez le désembuage à fond sur un pare-brise froid, et l’eau chaude en hiver.',
          'Pas de station de lavage haute pression.',
          'Fermez les portières en douceur : le choc suffit parfois à faire partir une fissure.',
        ],
      },
      {
        title: 'La technique',
        body: [
          'On nettoie l’impact, on fait le vide d’air à l’intérieur avec un injecteur, puis on remplit l’éclat de résine sous pression. La résine est durcie aux UV et polie à fleur. La trace reste légèrement visible de près, mais le verre retrouve sa solidité et l’éclat ne progresse plus.',
        ],
      },
    ],
    faq: [
      {
        q: 'La réparation est-elle prise en charge par l’assurance ?',
        a: "Oui, dès lors que vous avez la garantie bris de glace. La plupart des assureurs la prennent en charge sans appliquer de franchise, parce qu'elle leur coûte bien moins cher qu'un remplacement.",
      },
      {
        q: 'Et si l’impact est trop grand ?',
        a: 'On vous le dit sur place, photo à l’appui, et on vous propose un remplacement. On ne force pas une réparation qui ne tiendrait pas.',
      },
    ],
  },
  {
    slug: 'calibrage-adas',
    icon: 'adas',
    label: 'Calibrage ADAS',
    h1: 'Calibrage de caméra ADAS',
    metaTitle: 'Calibrage ADAS après remplacement de pare-brise',
    metaDescription:
      "Caméra de pare-brise, freinage d'urgence, maintien dans la voie : calibrage ADAS statique ou dynamique après chaque remplacement, avec rapport de calibrage.",
    teaser: 'Recalibrage de la caméra après chaque remplacement, rapport remis avec la facture.',
    lead: 'Freinage d’urgence, maintien dans la voie, lecture des panneaux, feux de route automatiques : tout passe par la caméra fixée derrière le pare-brise. Un décalage d’un degré, et le système regarde à plusieurs mètres de la bonne trajectoire.',
    facts: [
      { k: 'Obligatoire', v: 'Après chaque remplacement' },
      { k: 'Méthodes', v: 'Statique ou dynamique' },
      { k: 'Justificatif', v: 'Rapport de calibrage' },
    ],
    blocks: [
      {
        title: 'Votre voiture est concernée si…',
        list: [
          'Vous voyez un boîtier noir derrière le rétroviseur intérieur, côté pare-brise.',
          'Elle freine seule face à un obstacle ou corrige la trajectoire quand vous mordez une ligne.',
          'Elle affiche les limitations de vitesse lues sur les panneaux.',
          'Elle est sortie d’usine après juillet 2024 : le règlement européen GSR2 rend ces aides obligatoires sur toutes les voitures neuves.',
        ],
      },
      {
        title: 'Statique ou dynamique',
        body: [
          'Le calibrage statique se fait à l’atelier : la voiture est placée devant une mire positionnée au millimètre, l’outil de diagnostic aligne la caméra sur la cible.',
          'Le calibrage dynamique se fait en roulant, outil branché, sur une route au marquage net, à vitesse stabilisée. Certains constructeurs imposent l’un, d’autres l’autre, parfois les deux. On suit la procédure du constructeur de votre véhicule.',
        ],
      },
    ],
    faq: [
      {
        q: 'Le calibrage est-il pris en charge par l’assurance ?',
        a: 'Oui. Il fait partie du remplacement du pare-brise, puisqu’il est imposé par le constructeur, et il est facturé sur la même facture bris de glace.',
      },
      {
        q: 'Que se passe-t-il si on ne calibre pas ?',
        a: 'Un voyant peut s’allumer, mais pas toujours. Le plus souvent, les aides fonctionnent en apparence et réagissent trop tard ou au mauvais endroit. C’est précisément le risque.',
      },
    ],
  },
  {
    slug: 'vitrage-automobile',
    icon: 'car',
    label: 'Tout vitrage automobile',
    h1: 'Vitres latérales, lunette arrière, toit vitré',
    metaTitle: 'Remplacement de vitre latérale et lunette arrière',
    metaDescription:
      'Vitre brisée après une effraction, lunette arrière cassée, toit panoramique fissuré : remplacement de tout le vitrage automobile, aspiration des débris comprise.',
    teaser:
      'Vitres latérales, lunette arrière, custodes, toit panoramique : tout le vitrage du véhicule.',
    lead: 'Une vitre latérale ou une lunette arrière en verre trempé ne se fissure pas : elle éclate en milliers de morceaux. On remplace le vitrage, on aspire l’habitacle et les mécanismes de lève-vitre, et on vous rend un véhicule fermé le jour même dans la plupart des cas.',
    facts: [
      { k: 'Débris', v: 'Aspiration complète' },
      { k: 'Délai', v: 'Souvent le jour même' },
      { k: 'Effraction', v: 'Prise en charge bris de glace' },
    ],
    blocks: [
      {
        title: 'Ce qu’on remplace',
        list: [
          'Vitres de portière avant et arrière, y compris surteintées d’usine.',
          'Lunette arrière, avec rebranchement du dégivrage et de l’antenne intégrée.',
          'Custodes et vitres de hayon.',
          'Toits vitrés et panoramiques.',
          'Rétroviseurs : glaces seules.',
        ],
      },
      {
        title: 'Après une effraction',
        body: [
          'Déposez plainte et gardez le récépissé : votre assureur le demandera. Ne roulez pas avec une fenêtre ouverte sous la pluie, l’électronique de portière n’aime pas ça. Appelez-nous, on vous dit si on peut venir sur place.',
        ],
      },
    ],
    faq: [
      {
        q: 'La vitre est-elle disponible tout de suite ?',
        a: 'Les références courantes sont livrées le jour même ou le lendemain matin. Pour les véhicules plus rares, on vous annonce le délai au moment du devis.',
      },
    ],
  },
  {
    slug: 'vitres-teintees',
    icon: 'tint',
    label: 'Vitres teintées',
    h1: 'Pose de film teinté pour vitres',
    metaTitle: 'Vitres teintées : pose de film homologué',
    metaDescription:
      "Pose de film solaire teinté homologué sur vitres arrière et lunette : moins de chaleur, plus d'intimité, 99 % des UV filtrés. Conforme à la réglementation de 2017.",
    teaser:
      'Film solaire homologué, posé dans les règles : à l’arrière seulement, comme le prévoit la loi.',
    lead: 'Un film de qualité, posé sans bulles ni bords décollés, filtre la chaleur et les UV et protège l’habitacle des regards. On pose uniquement ce que la loi autorise, pour que vous ne preniez pas d’amende au premier contrôle.',
    facts: [
      { k: 'UV filtrés', v: 'Jusqu’à 99 %' },
      { k: 'Zones autorisées', v: 'Vitres arrière et lunette' },
      { k: 'Pose', v: 'Une demi-journée' },
    ],
    blocks: [
      {
        title: 'Ce que dit la loi',
        body: [
          'Depuis le 1er janvier 2017, le pare-brise et les vitres latérales avant doivent laisser passer au moins 70 % de la lumière. Un film plus foncé à l’avant est sanctionné d’une amende de 135 € et d’un retrait de 3 points, avec immobilisation possible du véhicule.',
          'Les vitres arrière, les custodes et la lunette arrière peuvent être teintées librement. Une dérogation existe pour certaines raisons médicales, sur certificat.',
        ],
      },
      {
        title: 'Les teintes',
        list: [
          'Légère (environ 50 % de transmission) : discret, surtout anti-chaleur.',
          'Moyenne (environ 20 %) : le meilleur compromis intimité et visibilité.',
          'Foncée (environ 5 %) : opaque de l’extérieur, rendu « limousine ».',
        ],
      },
    ],
    faq: [
      {
        q: 'Est-ce que je peux encore voir dehors la nuit ?',
        a: 'Oui avec une teinte moyenne, sans difficulté. En teinte foncée, la visibilité de nuit par les vitres arrière baisse nettement : on vous montre les échantillons avant de choisir.',
      },
      {
        q: 'Le film est-il pris en charge par l’assurance ?',
        a: 'Non, c’est un équipement esthétique et de confort. En revanche, si une vitre teintée d’usine est cassée, son remplacement l’est.',
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
