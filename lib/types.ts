import type { RankTierId } from './constants/ranks';
import type { Rule } from './constants/rules';
import type { Battleground } from './constants/battlegrounds';
import type { FontId } from './constants/fonts';

export type ResumeForm = {
  handle: string;
  iconDataUrl: string;
  oshiPokemon: string[];
  battleOshi: string[];
  comment: string;
  narabi: string[];
  playHistory: string;
  rules: Rule[];
  battleground: Battleground | null;
  battleStyle: string;
  rank: { tier: RankTierId; step: string | null } | null;
  snsLink: string;
  wantToConnect: string;
  oshiCreator: string;
};

export type ThemeId = 'official' | 'retro' | 'starry';

export type AppState = {
  form: ResumeForm;
  themeId: ThemeId;
  fontId: FontId;
  pokemonListMode: 'pokechan' | 'all';
  hasSeenInitialModal: boolean;
};

export const INITIAL_FORM: ResumeForm = {
  handle: '',
  iconDataUrl: '',
  oshiPokemon: [],
  battleOshi: [],
  comment: '',
  narabi: [],
  playHistory: '',
  rules: [],
  battleground: null,
  battleStyle: '',
  rank: null,
  snsLink: '',
  wantToConnect: '',
  oshiCreator: '',
};
