import { describe, it, expect } from 'vitest';
import { buildFilename } from '@/lib/filename';

describe('buildFilename', () => {
  it('formats with handle and date stamp', () => {
    const d = new Date('2026-05-14T15:23:09');
    const result = buildFilename('タロウ', d);
    expect(result).toMatch(/^pokechan-resume-タロウ-\d{8}-\d{6}\.png$/);
  });
  it('uses anonymous when handle is empty', () => {
    const result = buildFilename('', new Date());
    expect(result).toMatch(/^pokechan-resume-anonymous-/);
  });
  it('strips unsafe characters', () => {
    const result = buildFilename('a/b?c', new Date());
    expect(result).toMatch(/^pokechan-resume-abc-/);
  });
});
