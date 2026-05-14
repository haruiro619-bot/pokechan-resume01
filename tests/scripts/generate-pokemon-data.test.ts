import { describe, it, expect } from 'vitest';
import { parsePokemonList } from '@/scripts/generate-pokemon-data';

describe('parsePokemonList', () => {
  it('strips whitespace and removes empties and duplicates while preserving order', () => {
    const input = 'フシギバナ\r\nリザードン\n\nリザードン\n  カメックス  \n';
    expect(parsePokemonList(input)).toEqual(['フシギバナ', 'リザードン', 'カメックス']);
  });

  it('returns an empty array for empty input', () => {
    expect(parsePokemonList('')).toEqual([]);
  });
});
