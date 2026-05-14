import { describe, it, expect } from 'vitest';
import { computeSquareCrop } from '@/lib/image-crop';

describe('computeSquareCrop', () => {
  it('returns full image when already square', () => {
    expect(computeSquareCrop(100, 100, 0.5, 0.5, 1)).toEqual({ x: 0, y: 0, size: 100 });
  });
  it('clamps crop within image bounds for landscape', () => {
    const r = computeSquareCrop(200, 100, 0.5, 0.5, 1);
    expect(r.size).toBe(100);
    expect(r.x).toBe(50);
    expect(r.y).toBe(0);
  });
  it('applies zoom by shrinking size', () => {
    const r = computeSquareCrop(200, 200, 0.5, 0.5, 2);
    expect(r.size).toBe(100);
    expect(r.x).toBe(50);
    expect(r.y).toBe(50);
  });
});
