import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiPlaqueProvider, titleCase, toIsoDate } from '@/lib/vehicle/providers';

afterEach(() => vi.unstubAllGlobals());

describe('normalisation', () => {
  it('met en forme les libellés', () => {
    expect(titleCase('PEUGEOT')).toBe('Peugeot');
    expect(titleCase('BMW')).toBe('BMW');
    expect(titleCase('1.2 PURETECH 100 ALLURE')).toBe('1.2 Puretech 100 Allure');
  });
  it('convertit les dates', () => {
    expect(toIsoDate('23-04-2019')).toBe('2019-04-23');
    expect(toIsoDate('2019-04-23')).toBe('2019-04-23');
    expect(toIsoDate('n/c')).toBeUndefined();
  });
});

describe('apiPlaqueProvider', () => {
  const run = (body: unknown, status = 200) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
    vi.stubGlobal('fetch', fetchMock);
    const p = apiPlaqueProvider({ token: 'secret' });
    return { fetchMock, result: p.lookup('AB-123-CD', new AbortController().signal) };
  };

  it('transforme la réponse en fiche véhicule', async () => {
    const { fetchMock, result } = run({
      data: {
        erreur: '',
        marque: 'PEUGEOT',
        modele: '208',
        sra_commercial: '1.2 PURETECH 100 ALLURE',
        date1erCir_fr: '12-03-2021',
        energieNGC: 'ESSENCE',
        carrosserieCG: 'BERLINE',
        nb_portes: '5',
        puisFisc: '5',
        vin: 'VF3XXXXXXXXXXXXXX',
      },
    });
    const r = await result;
    expect(r).toEqual({
      status: 'found',
      vehicle: {
        plate: 'AB-123-CD',
        make: 'Peugeot',
        model: '208',
        version: '1.2 Puretech 100 Allure',
        firstRegistration: '2021-03-12',
        fuel: 'Essence',
        body: 'Berline',
        doors: 5,
        gearbox: undefined,
        fiscalPower: 5,
      },
    });
    expect(JSON.stringify(r)).not.toContain('VF3'); // le VIN ne sort jamais
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get('immatriculation')).toBe('AB-123-CD');
  });

  it('plaque inconnue', async () => {
    expect(await run({ data: { erreur: 'Plaque non trouvée' } }).result).toEqual({
      status: 'not_found',
    });
  });

  it('erreur HTTP', async () => {
    expect((await run({}, 500).result).status).toBe('error');
  });
});
