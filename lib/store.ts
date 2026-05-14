import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, ResumeForm, ThemeId } from './types';
import { INITIAL_FORM } from './types';

type Actions = {
  updateForm: (patch: Partial<ResumeForm>) => void;
  resetForm: () => void;
  setTheme: (themeId: ThemeId) => void;
  setPokemonListMode: (mode: 'pokechan' | 'all') => void;
  markInitialModalSeen: () => void;
};

export const useAppStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      form: { ...INITIAL_FORM },
      themeId: 'official',
      pokemonListMode: 'pokechan',
      hasSeenInitialModal: false,
      updateForm: (patch) => set((s) => ({ form: { ...s.form, ...patch } })),
      resetForm: () => set({ form: { ...INITIAL_FORM } }),
      setTheme: (themeId) => set({ themeId }),
      setPokemonListMode: (pokemonListMode) => set({ pokemonListMode }),
      markInitialModalSeen: () => set({ hasSeenInitialModal: true }),
    }),
    {
      name: 'pokechan-resume',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        form: { ...state.form, iconDataUrl: '' },
        themeId: state.themeId,
        pokemonListMode: state.pokemonListMode,
        hasSeenInitialModal: state.hasSeenInitialModal,
      }),
    },
  ),
);
