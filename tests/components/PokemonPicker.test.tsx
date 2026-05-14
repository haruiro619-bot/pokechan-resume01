import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PokemonPicker } from '@/components/Form/PokemonPicker';
import { useAppStore } from '@/lib/store';
import { INITIAL_FORM } from '@/lib/types';

beforeEach(() => {
  useAppStore.setState({
    form: { ...INITIAL_FORM },
    themeId: 'official',
    pokemonListMode: 'pokechan',
    hasSeenInitialModal: false,
  });
});

describe('PokemonPicker', () => {
  it('filters list by katakana incremental search', async () => {
    render(<PokemonPicker label="推し" value={[]} onChange={() => {}} max={3} />);
    await userEvent.type(screen.getByLabelText('ポケモン検索'), 'リザード');
    expect(screen.getByRole('button', { name: 'リザードン' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'フシギバナ' })).not.toBeInTheDocument();
  });

  it('adds selected pokemon as chip and respects max', async () => {
    let v: string[] = [];
    const { rerender } = render(
      <PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'フシギバナ' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />);
    expect(v).toEqual(['フシギバナ']);

    // duplicate ignored
    await userEvent.click(screen.getByRole('button', { name: 'フシギバナ' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />);
    expect(v).toEqual(['フシギバナ']);

    // second pick
    await userEvent.click(screen.getByRole('button', { name: 'リザードン' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />);
    expect(v).toEqual(['フシギバナ', 'リザードン']);

    // max exceeded — カメックス should not be added
    await userEvent.click(screen.getByRole('button', { name: 'カメックス' }));
    expect(v.length).toBe(2);
  });

  it('removes pokemon when chip × is clicked', async () => {
    let v = ['フシギバナ'];
    const { rerender } = render(
      <PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={3} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'フシギバナ を削除' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={3} />);
    expect(v).toEqual([]);
  });
});
