import type { APIRoute } from 'astro';
import { normalizePlate } from '@/lib/plate';
import { allowRequest, lookupVehicle, provider } from '@/lib/vehicle/service';

/** Rendu à la demande : cette route seule tourne sur le serveur. */
export const prerender = false;

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extra,
    },
  });

export const GET: APIRoute = async ({ url, request, clientAddress, site }) => {
  // Appels réservés au site lui-même (un navigateur envoie toujours Sec-Fetch-Site sur fetch()).
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return json({ error: 'forbidden' }, 403);
  const origin = request.headers.get('origin');
  if (origin && site && origin !== site.origin && !import.meta.env.DEV)
    return json({ error: 'forbidden' }, 403);

  if (!provider) return json({ error: 'unavailable' }, 503);

  const plate = normalizePlate(url.searchParams.get('immat') ?? '');
  if (!plate) return json({ error: 'invalid_plate' }, 400);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress;
  if (!allowRequest(ip)) return json({ error: 'rate_limited' }, 429, { 'Retry-After': '600' });

  const result = await lookupVehicle(plate);
  switch (result.status) {
    case 'found':
      return json({ vehicle: result.vehicle, demo: provider.name === 'mock' });
    case 'not_found':
      return json({ error: 'not_found' }, 404);
    default:
      console.error(`[plaque] ${provider.name} : ${result.message}`);
      return json({ error: 'upstream' }, 502);
  }
};
