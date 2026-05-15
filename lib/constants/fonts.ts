export type FontId =
  | 'default'
  | 'mplusRounded'
  | 'kleeOne'
  | 'zenMaruGothic'
  | 'notoSerifJP'
  | 'shipporiMincho'
  | 'dotGothic16';

export type FontDef = {
  id: FontId;
  label: string;
  categoryLabel: 'ベーシック' | 'かわいい系' | 'かっこいい系';
  sample: string;
  cssVar: string;
};

export const FONTS: FontDef[] = [
  { id: 'default',        label: 'ゲーム文字',  categoryLabel: 'ベーシック',    sample: 'ポケモンチャンピオンズ',  cssVar: 'var(--font-sans)' },
  { id: 'mplusRounded',   label: 'まるまる',    categoryLabel: 'かわいい系',    sample: 'ふわふわ かわいい♪',     cssVar: 'var(--font-mplus-rounded)' },
  { id: 'kleeOne',        label: 'てがき',      categoryLabel: 'かわいい系',    sample: 'やさしい てがき✨',       cssVar: 'var(--font-klee)' },
  { id: 'zenMaruGothic',  label: 'ポップまる',  categoryLabel: 'かわいい系',    sample: 'ポップ★ なかよし',        cssVar: 'var(--font-zen-maru)' },
  { id: 'notoSerifJP',    label: 'みやび',      categoryLabel: 'かっこいい系',  sample: '凛として 優雅に',          cssVar: 'var(--font-noto-serif)' },
  { id: 'shipporiMincho', label: 'しっぽり',    categoryLabel: 'かっこいい系',  sample: '繊細な 明朝の美',          cssVar: 'var(--font-shippori)' },
  { id: 'dotGothic16',    label: 'ドット',      categoryLabel: 'かっこいい系',  sample: 'GAME START 冒険へ',        cssVar: 'var(--font-dot-gothic)' },
];

export const DEFAULT_FONT_ID: FontId = 'default';
