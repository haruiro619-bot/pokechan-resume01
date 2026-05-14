import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/lib/store';
import { INITIAL_FORM } from '@/lib/types';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      form: { ...INITIAL_FORM },
      themeId: 'official',
      pokemonListMode: 'pokechan',
      hasSeenInitialModal: false,
    });
  });

  it('updates a form field', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ' });
    expect(useAppStore.getState().form.handle).toBe('タロウ');
  });

  it('switches theme without losing form data', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ' });
    useAppStore.getState().setTheme('retro');
    expect(useAppStore.getState().themeId).toBe('retro');
    expect(useAppStore.getState().form.handle).toBe('タロウ');
  });

  it('resets form to initial values', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ', comment: 'こんにちは' });
    useAppStore.getState().resetForm();
    expect(useAppStore.getState().form).toEqual(INITIAL_FORM);
  });

  it('persists everything except iconDataUrl to localStorage', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ', iconDataUrl: 'data:image/png;base64,XXX' });
    const raw = localStorage.getItem('pokechan-resume');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.form.handle).toBe('タロウ');
    expect(parsed.state.form.iconDataUrl).toBe('');
  });
});
