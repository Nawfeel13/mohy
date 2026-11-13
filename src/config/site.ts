/**
 * Toutes les infos de l'entreprise sont ici, et uniquement ici.
 * Les champs marqués « À COMPLÉTER » sont masqués du site tant qu'ils sont vides.
 */
export const site = {
  name: 'Pareglass Auto',
  legalName: 'Pareglass Auto', // À COMPLÉTER : raison sociale exacte (ex. SAS PAREGLASS AUTO)
  siret: '', // À COMPLÉTER
  phone: {
    display: '06 98 62 13 12',
    href: 'tel:+33698621312',
    e164: '+33698621312',
    whatsapp: '33698621312',
  },
  email: '', // À COMPLÉTER (ex. contact@pareglass-auto.fr)
  address: {
    street: '181', // À COMPLÉTER : numéro + nom de rue (le 181 est visible sur la façade)
    postalCode: '', // À COMPLÉTER
    city: '', // À COMPLÉTER
    region: '',
    country: 'FR',
  },
  /** Coordonnées GPS de l'atelier (pour le schéma LocalBusiness et l'itinéraire). */
  geo: null as null | { lat: number; lng: number },
  /** Communes desservies pour l'intervention à domicile. */
  serviceArea: [] as string[], // À COMPLÉTER (ex. ['Marseille', 'Aubagne', 'Aix-en-Provence'])
  hours: {
    label: 'Du lundi au samedi, 9h – 18h',
    short: 'Lun – Sam · 9h – 18h',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00',
  },
  offer: {
    amount: 150,
    headline: 'Franchise ou 150 € offerts',
    conditions:
      "Offre réservée au remplacement de pare-brise pris en charge au titre d'une garantie bris de glace. Une seule offre par sinistre, non cumulable. Détails à l'atelier.",
  },
  social: {
    google: '', // À COMPLÉTER : lien fiche Google Business
    instagram: '',
    facebook: '',
  },
} as const;

export const hasAddress = Boolean(site.address.postalCode && site.address.city);

export const fullAddress = hasAddress
  ? `${site.address.street}, ${site.address.postalCode} ${site.address.city}`
  : '';

export const mapsUrl = site.geo
  ? `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`
  : hasAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${fullAddress}`)}`
    : '';

/** « à Marseille » si la ville est connue, sinon rien : évite les titres creux. */
export const inCity = site.address.city ? ` à ${site.address.city}` : '';

export const insurers = [
  'AXA',
  'Allianz',
  'MAAF',
  'Groupama',
  'Generali',
  'Matmut',
  'MACIF',
  'GMF',
  'MAIF',
  'MMA',
  'Pacifica',
  'Direct Assurance',
  'Covéa',
  'April',
  'Leocare',
  'Olivier Assurance',
] as const;

export const carBrands = [
  'Renault',
  'Peugeot',
  'Citroën',
  'Volkswagen',
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Dacia',
  'Toyota',
  'Ford',
  'Opel',
  'Fiat',
  'Kia',
  'Hyundai',
  'Nissan',
  'Seat',
  'Škoda',
  'Tesla',
] as const;
