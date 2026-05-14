import pokechan from '@/data/pokemon-pokechan.json';
import all from '@/data/pokemon-all.json';

export const POKEMON_POKECHAN: readonly string[] = pokechan;
export const POKEMON_ALL: readonly string[] = all;

export function searchPokemon(list: readonly string[], query: string): readonly string[] {
  const q = query.trim();
  if (!q) return list;
  return list.filter((name) => name.includes(q));
}
