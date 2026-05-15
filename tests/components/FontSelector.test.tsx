import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FontSelector } from '@/components/Form/FontSelector';
import { useAppStore } from '@/lib/store';
import { INITIAL_FORM } from '@/lib/types';

beforeEach(() => {
  useAppStore.setState({
    form: { ...INITIAL_FORM },
    themeId: 'official',
    fontId: 'default',
    pokemonListMode: 'pokechan',
    hasSeenInitialModal: false,
  });
});

describe('FontSelector', () => {
  it('renders category headings', () => {
    render(<FontSelector />);
    expect(screen.getByText('かわいい系')).toBeInTheDocument();
    expect(screen.getByText('かっこいい系')).toBeInTheDocument();
  });

  it('renders sample text for each font', () => {
    render(<FontSelector />);
    const buttons = screen.getAllByText('トレーナーカード');
    expect(buttons.length).toBe(7);
  });

  it('marks the current font as selected', () => {
    useAppStore.setState({ fontId: 'mplusRounded' } as any);
    render(<FontSelector />);
    const btn = screen.getByRole('button', { name: 'まるまる' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls setFont when a font button is clicked', async () => {
    render(<FontSelector />);
    const btn = screen.getByRole('button', { name: 'みやび' });
    await userEvent.click(btn);
    expect(useAppStore.getState().fontId).toBe('notoSerifJP');
  });
});
