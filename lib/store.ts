import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, ResumeForm, ThemeId } from './types';
import { INITIAL_FORM } from './types';
import type { FontId } from './constants/fonts';
import { DEFAULT_FONT_ID } from './constants/fonts';

type Actions = {
  updateForm: (patch: Partial<ResumeForm>) => void;
  resetForm: () => void;
  setTheme: (themeId: ThemeId) => void;
  setFont: (fontId: FontId) => void;
  setPokemonListMode: (mode: 'pokechan' | 'all') => void;
  markInitialModalSeen: () => void;
};

export const useAppStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      form: { ...INITIAL_FORM },
      themeId: 'official',
      fontId: DEFAULT_FONT_ID,
      pokemonListMode: 'pokechan',
      hasSeenInitialModal: false,
      updateForm: (patch) => set((s) => ({ form: { ...s.form, ...patch } })),
      resetForm: () => set({ form: { ...INITIAL_FORM } }),
      setTheme: (themeId) => set({ themeId }),
      setFont: (fontId) => set({ fontId }),
      setPokemonListMode: (pokemonListMode) => set({ pokemonListMode }),
      markInitialModalSeen: () => set({ hasSeenInitialModal: true }),
    }),
    {
      name: 'pokechan-resume',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        form: { ...state.form, iconDataUrl: '' },
        themeId: state.themeId,
        fontId: state.fontId,
        pokemonListMode: state.pokemonListMode,
        hasSeenInitialModal: state.hasSeenInitialModal,
      }),
    },
  ),
);
