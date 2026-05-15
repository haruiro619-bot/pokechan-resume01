export type AccentId = 'electric' | 'fire' | 'water' | 'ghost' | 'grass' | 'normal';

export type AccentDef = {
  id: AccentId;
  label: string;
  emoji: string;
  primary: string;
  secondary: string;
  glow: string;
  bgFrom: string;
  bgMid: string;
  bgTo: string;
};

export const ACCENTS: readonly AccentDef[] = [
  {
    id: 'electric',
    label: 'でんき',
    emoji: '⚡',
    primary: '#F4C430',
    secondary: '#B8860B',
    glow: 'rgba(244,196,48,0.35)',
    bgFrom: '#080c18',
    bgMid: '#0d1020',
    bgTo: '#0a0d22',
  },
  {
    id: 'fire',
    label: 'ほのお',
    emoji: '🔥',
    primary: '#FF7040',
    secondary: '#C0392B',
    glow: 'rgba(255,112,64,0.35)',
    bgFrom: '#140808',
    bgMid: '#1a0c08',
    bgTo: '#180a0a',
  },
  {
    id: 'water',
    label: 'みず',
    emoji: '💧',
    primary: '#4FC3F7',
    secondary: '#0288D1',
    glow: 'rgba(79,195,247,0.35)',
    bgFrom: '#060e18',
    bgMid: '#09131e',
    bgTo: '#071020',
  },
  {
    id: 'ghost',
    label: 'ゴースト',
    emoji: '🌙',
    primary: '#C084FC',
    secondary: '#7C3AED',
    glow: 'rgba(192,132,252,0.35)',
    bgFrom: '#09060f',
    bgMid: '#100a1a',
    bgTo: '#0d0820',
  },
  {
    id: 'grass',
    label: 'くさ',
    emoji: '🍃',
    primary: '#6BCB77',
    secondary: '#2D6A4F',
    glow: 'rgba(107,203,119,0.35)',
    bgFrom: '#060e08',
    bgMid: '#09140a',
    bgTo: '#07120a',
  },
  {
    id: 'normal',
    label: 'ノーマル',
    emoji: '✨',
    primary: '#C8C8D4',
    secondary: '#8899AA',
    glow: 'rgba(200,200,212,0.25)',
    bgFrom: '#0c0c10',
    bgMid: '#111118',
    bgTo: '#0e0e14',
  },
] as const;

export const DEFAULT_ACCENT_ID: AccentId = 'electric';
