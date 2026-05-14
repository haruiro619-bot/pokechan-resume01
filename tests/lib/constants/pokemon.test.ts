import { describe, it, expect } from 'vitest';
import { POKEMON_POKECHAN, POKEMON_ALL, searchPokemon } from '@/lib/constants/pokemon';

describe('pokemon data', () => {
  it('exposes 211 pokechan entries', () => {
    expect(POKEMON_POKECHAN.length).toBe(211);
  });
  it('exposes 1050 all entries', () => {
    expect(POKEMON_ALL.length).toBe(1050);
  });
});

describe('searchPokemon', () => {
  it('returns full list when query is empty', () => {
    expect(searchPokemon(POKEMON_POKECHAN, '').length).toBe(211);
  });
  it('does substring match', () => {
    const r = searchPokemon(POKEMON_POKECHAN, 'ライチュウ');
    expect(r).toContain('ライチュウ');
    expect(r).toContain('ライチュウ（アローラ）');
  });
});
