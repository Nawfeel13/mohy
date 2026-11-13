import { formatPlateAsTyped, normalizePlate } from '@/lib/plate';
import type { Vehicle } from '@/lib/vehicle/types';

export type VehicleState =
  | { state: 'idle' }
  | { state: 'loading'; plate: string }
  | { state: 'found'; vehicle: Vehicle; demo: boolean }
  | { state: 'not_found'; plate: string }
  | { state: 'unavailable' };

const memo = new Map<string, Promise<VehicleState>>();

export function fetchVehicle(plate: string): Promise<VehicleState> {
  if (!memo.has(plate)) {
    memo.set(
      plate,
      fetch(`/api/vehicule?immat=${encodeURIComponent(plate)}`, {
        headers: { Accept: 'application/json' },
      })
        .then(async (r): Promise<VehicleState> => {
          if (r.ok) {
            const body = await r.json();
            return { state: 'found', vehicle: body.vehicle, demo: body.demo === true };
          }
          if (r.status === 404) return { state: 'not_found', plate };
          memo.delete(plate); // erreur passagère : on pourra réessayer
          return { state: 'unavailable' };
        })
        .catch(() => {
          memo.delete(plate);
          return { state: 'unavailable' } as const;
        }),
    );
  }
  return memo.get(plate)!;
}

/**
 * Branche la mise en forme et l'identification sur chaque champ [data-plate].
 * Chaque changement d'état est diffusé via l'événement « vehicle » sur le champ.
 */
export function bindPlates(root: ParentNode = document) {
  root.querySelectorAll<HTMLInputElement>('[data-plate]').forEach((input) => {
    let timer: number | undefined;
    let current = '';

    const emit = (detail: VehicleState) =>
      input.dispatchEvent(new CustomEvent<VehicleState>('vehicle', { detail, bubbles: true }));

    const check = () => {
      const plate = normalizePlate(input.value);
      if (plate === current) return;
      current = plate ?? '';
      if (!plate) return emit({ state: 'idle' });
      emit({ state: 'loading', plate });
      fetchVehicle(plate).then((s) => {
        if (current === plate) emit(s);
      });
    };

    input.addEventListener('input', () => {
      const atEnd = input.selectionStart === input.value.length;
      input.value = formatPlateAsTyped(input.value);
      if (atEnd) input.setSelectionRange(input.value.length, input.value.length);
      clearTimeout(timer);
      timer = window.setTimeout(check, 350);
    });

    // Laisse aux autres scripts le temps d'écouter l'événement « vehicle »
    if (input.value) setTimeout(check, 0);
  });
}
