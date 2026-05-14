export const BATTLEGROUNDS = [
  'ランクマッチ',
  'フレンド戦',
  '大会',
  'その他',
] as const;
export type Battleground = (typeof BATTLEGROUNDS)[number];
