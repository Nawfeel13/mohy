import type { LookupResult, Vehicle, VehicleProvider } from './types';

/* ---------- utilitaires de normalisation ---------- */

const pick = (o: Record<string, unknown>, ...keys: string[]) => {
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return undefined;
};

const ACRONYMS = new Set([
  'BMW',
  'DS',
  'MG',
  'GMC',
  'BYD',
  'KTM',
  'VW',
  'GT',
  'GTI',
  'TDI',
  'HDI',
  'DCI',
  'TCE',
  'SUV',
  'RS',
  'AMG',
  'CDI',
  'TSI',
  'TFSI',
  'E-TECH',
  'EV',
  'HYBRID4',
]);
/** « PEUGEOT » → « Peugeot », mais « BMW » reste « BMW » et « 1.2 PURETECH » → « 1.2 Puretech ». */
export function titleCase(s?: string) {
  if (!s) return s;
  return s
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((w) => {
      const up = w.toUpperCase();
      if (ACRONYMS.has(up) || (/\d/.test(w) && /^[a-z0-9.]+$/i.test(w) && w.length <= 4)) return up;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join('');
}

/** Accepte JJ-MM-AAAA, JJ/MM/AAAA ou AAAA-MM-JJ, renvoie AAAA-MM-JJ. */
export function toIsoDate(s?: string) {
  if (!s) return undefined;
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{2})[-/](\d{2})[-/](\d{4})/.exec(s);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return undefined;
}

const FUEL: Record<string, string> = {
  ES: 'Essence',
  ESSENCE: 'Essence',
  GO: 'Diesel',
  GAZOLE: 'Diesel',
  DIESEL: 'Diesel',
  EL: 'Électrique',
  ELECTRIC: 'Électrique',
  ELECTRIQUE: 'Électrique',
  EH: 'Hybride essence',
  GH: 'Hybride diesel',
  EE: 'Hybride rechargeable',
  GP: 'GPL',
  GPL: 'GPL',
  FE: 'Superéthanol E85',
};
const fuelLabel = (s?: string) => {
  if (!s) return undefined;
  const k = s.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  return FUEL[k] ?? (k.includes('HYBRID') ? 'Hybride' : titleCase(s));
};

const num = (s?: string) => {
  const n = s ? Number.parseInt(s, 10) : NaN;
  return Number.isFinite(n) ? n : undefined;
};

/* ---------- apiplaqueimmatriculation.com ---------- */

/**
 * Fournisseur par défaut. Les noms de champs varient selon les versions de l'API :
 * le mapping ci-dessous accepte plusieurs alias. Au premier appel réel, vérifier la réponse
 * brute (PLATE_API_DEBUG=1 l'affiche dans la console du serveur) et ajuster si besoin.
 */
export function apiPlaqueProvider(opts: { token: string; url?: string }): VehicleProvider {
  const base = opts.url ?? 'https://api.apiplaqueimmatriculation.com/plaque';
  return {
    name: 'apiplaque',
    async lookup(plate, signal): Promise<LookupResult> {
      const url = new URL(base);
      url.searchParams.set('immatriculation', plate);
      url.searchParams.set('token', opts.token);
      url.searchParams.set('pays', 'FR');

      const res = await fetch(url, {
        method: 'POST',
        signal,
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) return { status: 'not_found' };
      if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` };

      const json = (await res.json()) as Record<string, unknown>;
      if (process.env.PLATE_API_DEBUG === '1')
        console.log('[plaque] réponse brute', JSON.stringify(json));
      const d = (json.data && typeof json.data === 'object' ? json.data : json) as Record<
        string,
        unknown
      >;

      const err = pick(d, 'erreur', 'error');
      const make = pick(d, 'marque', 'make', 'brand');
      const model = pick(d, 'modele', 'model');
      if (!make || !model)
        return err ? { status: 'not_found' } : { status: 'error', message: 'réponse incomplète' };

      const vehicle: Vehicle = {
        plate,
        make: titleCase(make)!,
        model: titleCase(model)!,
        version: titleCase(pick(d, 'sra_commercial', 'version', 'type_version', 'finition')),
        firstRegistration: toIsoDate(
          pick(d, 'date1erCir_us', 'date1erCir_fr', 'date_mise_circulation', 'date1erCir'),
        ),
        fuel: fuelLabel(pick(d, 'energieNGC', 'energie', 'carburant', 'fuel')),
        body: titleCase(pick(d, 'carrosserieCG', 'carrosserie', 'body')),
        doors: num(pick(d, 'nb_portes', 'portes', 'doors')),
        gearbox: titleCase(pick(d, 'boite_vitesse', 'boite', 'gearbox')),
        fiscalPower: num(pick(d, 'puisFisc', 'puissance_fiscale', 'cv')),
      };
      return { status: 'found', vehicle };
    },
  };
}

/* ---------- Démo locale ---------- */

const DEMO: Omit<Vehicle, 'plate'>[] = [
  {
    make: 'Peugeot',
    model: '208',
    version: '1.2 PureTech 100 Allure',
    firstRegistration: '2021-03-12',
    fuel: 'Essence',
    body: 'Berline',
    doors: 5,
    gearbox: 'Manuelle',
    fiscalPower: 5,
  },
  {
    make: 'Renault',
    model: 'Clio V',
    version: '1.0 TCe 90 Evolution',
    firstRegistration: '2022-06-02',
    fuel: 'Essence',
    body: 'Berline',
    doors: 5,
    gearbox: 'Manuelle',
    fiscalPower: 5,
  },
  {
    make: 'Volkswagen',
    model: 'Golf VII',
    version: '2.0 TDI 150 Carat',
    firstRegistration: '2017-09-20',
    fuel: 'Diesel',
    body: 'Berline',
    doors: 5,
    gearbox: 'Automatique',
    fiscalPower: 8,
  },
  {
    make: 'Citroën',
    model: 'Berlingo',
    version: '1.5 BlueHDi 100 Feel',
    firstRegistration: '2019-11-04',
    fuel: 'Diesel',
    body: 'Ludospace',
    doors: 5,
    gearbox: 'Manuelle',
    fiscalPower: 5,
  },
  {
    make: 'Dacia',
    model: 'Sandero',
    version: '1.0 SCe 65',
    firstRegistration: '2014-04-15',
    fuel: 'Essence',
    body: 'Berline',
    doors: 5,
    gearbox: 'Manuelle',
    fiscalPower: 4,
  },
];

/**
 * Faux fournisseur pour développer sans consommer de crédits. Activé par défaut en `npm run dev`
 * tant qu'aucun jeton n'est configuré. Les plaques commençant par « ZZ » simulent un véhicule inconnu.
 */
export const mockProvider: VehicleProvider = {
  name: 'mock',
  async lookup(plate) {
    await new Promise((r) => setTimeout(r, 450));
    if (plate.startsWith('ZZ')) return { status: 'not_found' };
    const i = [...plate].reduce((a, c) => a + c.charCodeAt(0), 0) % DEMO.length;
    return { status: 'found', vehicle: { plate, ...DEMO[i] } };
  },
};
