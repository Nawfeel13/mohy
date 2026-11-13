/**
 * Immatriculations françaises — utilisable côté navigateur comme côté serveur.
 * SIV (depuis 2009) : AB-123-CD. FNI (ancien système) : 123 ABC 45, 1234 AB 75, 12 ABC 2A…
 */

const SIV = /^([A-HJ-NP-TV-Z]{2})(\d{3})([A-HJ-NP-TV-Z]{2})$/;
const FNI = /^(\d{1,4})([A-Z]{1,3})(\d{2}|2A|2B|97\d)$/;

/** Retire espaces/tirets, met en majuscules. */
export const compactPlate = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Renvoie la plaque au format canonique (AB-123-CD / 123-ABC-45), ou null si invalide. */
export function normalizePlate(raw: string): string | null {
  const c = compactPlate(raw);
  const siv = SIV.exec(c);
  if (siv) return `${siv[1]}-${siv[2]}-${siv[3]}`;
  const fni = FNI.exec(c);
  if (fni) return `${fni[1]}-${fni[2]}-${fni[3]}`;
  return null;
}

/** Mise en forme à la volée pendant la saisie : « ab123c » → « AB-123-C ». */
export function formatPlateAsTyped(raw: string): string {
  const c = compactPlate(raw);
  if (/^\d/.test(c)) return raw.toUpperCase(); // ancien format : on ne force rien
  const m = /^([A-Z]{0,2})(\d{0,3})([A-Z]{0,2})$/.exec(c);
  if (!m) return raw.toUpperCase();
  const [, a, b, d] = m;
  const typedDash = a.length === 2 && !b && raw.endsWith('-');
  return [a, b, d].filter(Boolean).join('-') + (typedDash ? '-' : '');
}
