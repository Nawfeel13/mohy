import { PLATE_API_PROVIDER, PLATE_API_TOKEN, PLATE_API_URL } from 'astro:env/server';
import { apiPlaqueProvider, mockProvider } from './providers';
import type { LookupResult, VehicleProvider } from './types';

/**
 * Choix du fournisseur : explicite via PLATE_API_PROVIDER, sinon réel si un jeton existe, sinon désactivé.
 * La démo (véhicules fictifs) ne s'active jamais toute seule : il faut PLATE_API_PROVIDER=mock.
 */
function resolveProvider(): VehicleProvider | null {
  const choice = PLATE_API_PROVIDER ?? (PLATE_API_TOKEN ? 'apiplaque' : 'off');
  if (choice === 'mock') return mockProvider;
  if (choice === 'apiplaque' && PLATE_API_TOKEN)
    return apiPlaqueProvider({ token: PLATE_API_TOKEN, url: PLATE_API_URL });
  return null;
}

export const provider = resolveProvider();

/* Cache mémoire : une plaque déjà cherchée ne recoûte pas de crédit pendant 7 jours. */
const TTL = 7 * 24 * 3600_000;
const MAX_ENTRIES = 5000;
const cache = new Map<string, { at: number; result: LookupResult }>();

export async function lookupVehicle(plate: string): Promise<LookupResult> {
  if (!provider) return { status: 'error', message: 'service non configuré' };

  const hit = cache.get(plate);
  if (hit && Date.now() - hit.at < TTL) return hit.result;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const result = await provider.lookup(plate, ctrl.signal);
    if (result.status !== 'error') {
      if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value!);
      cache.set(plate, { at: Date.now(), result });
    }
    return result;
  } catch (e) {
    return { status: 'error', message: ctrl.signal.aborted ? 'délai dépassé' : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

/* Limite par IP : protège le quota payant contre les robots. */
const WINDOW = 10 * 60_000;
const MAX_PER_WINDOW = 15;
const hits = new Map<string, number[]>();

export function allowRequest(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear();
  return true;
}
