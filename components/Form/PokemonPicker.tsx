'use client';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { POKEMON_ALL, POKEMON_POKECHAN, searchPokemon } from '@/lib/constants/pokemon';

type Props = {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  min?: number;
  max: number;
  hint?: string;
};

export function PokemonPicker({ label, value, onChange, min = 1, max, hint }: Props) {
  const mode = useAppStore(s => s.pokemonListMode);
  const setMode = useAppStore(s => s.setPokemonListMode);
  const [query, setQuery] = useState('');

  const source = mode === 'pokechan' ? POKEMON_POKECHAN : POKEMON_ALL;
  const results = useMemo(() => searchPokemon(source, query).slice(0, 80), [source, query]);

  const add = (name: string) => {
    if (value.includes(name)) return;
    if (value.length >= max) return;
    onChange([...value, name]);
  };
  const remove = (name: string) => onChange(value.filter(n => n !== name));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      <p className="text-xs text-neutral-500">{min === max ? `${max}匹` : `${min}〜${max}匹`}選択</p>

      <div className="flex flex-wrap gap-1">
        {value.map((name) => (
          <span key={name} className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded text-sm">
            {name}
            <button
              type="button"
              aria-label={`${name} を削除`}
              onClick={() => remove(name)}
              className="text-neutral-500 hover:text-neutral-900"
            >×</button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === 'pokechan'}
            onChange={() => setMode('pokechan')}
          />
          ポケチャン内定（211）
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === 'all'}
            onChange={() => setMode('all')}
          />
          全ポケモン（1050）
        </label>
      </div>

      <Input
        aria-label="ポケモン検索"
        placeholder="カタカナで検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="max-h-40 overflow-y-auto border rounded">
        {results.map((name) => {
          const selected = value.includes(name);
          const disabled = !selected && value.length >= max;
          return (
            <button
              key={name}
              type="button"
              disabled={disabled}
              onClick={() => add(name)}
              className={`block w-full text-left px-3 py-1 text-sm hover:bg-neutral-100 ${selected ? 'bg-neutral-200' : ''} disabled:opacity-40`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
