import { describe, expect, it } from 'vitest';
import { formatPlateAsTyped, normalizePlate } from '@/lib/plate';

describe('normalizePlate', () => {
  it.each([
    ['ab123cd', 'AB-123-CD'],
    ['AB-123-CD', 'AB-123-CD'],
    [' ab 123 cd ', 'AB-123-CD'],
    ['123 abc 45', '123-ABC-45'],
    ['1234 AB 2A', '1234-AB-2A'],
  ])('%s → %s', (raw, out) => expect(normalizePlate(raw)).toBe(out));

  it.each(['', 'AB-123', 'AB-12-CD', 'IO-123-CD', 'AB-123-CD-1'])('rejette « %s »', (raw) =>
    expect(normalizePlate(raw)).toBeNull(),
  );
});

describe('formatPlateAsTyped', () => {
  it.each([
    ['a', 'A'],
    ['ab1', 'AB-1'],
    ['ab-', 'AB-'],
    ['ab123c', 'AB-123-C'],
    ['ab123cd', 'AB-123-CD'],
  ])('%s → %s', (raw, out) => expect(formatPlateAsTyped(raw)).toBe(out));
});
