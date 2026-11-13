/** Fiche véhicule renvoyée au navigateur. Volontairement réduite : pas de VIN, rien sur le titulaire. */
export interface Vehicle {
  plate: string;
  make: string;
  model: string;
  /** Finition / motorisation commerciale, ex. « 1.2 PureTech 100 Allure » */
  version?: string;
  /** Date de 1re mise en circulation, ISO AAAA-MM-JJ */
  firstRegistration?: string;
  fuel?: string;
  body?: string;
  doors?: number;
  gearbox?: string;
  fiscalPower?: number;
}

export type LookupResult =
  | { status: 'found'; vehicle: Vehicle }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

export interface VehicleProvider {
  name: string;
  lookup(plate: string, signal: AbortSignal): Promise<LookupResult>;
}
