export type RankTierId = 'monster' | 'super' | 'hyper' | 'master' | 'champion';

export type RankTier = {
  id: RankTierId;
  label: string;
  steps: readonly string[];
};

export const RANKS: readonly RankTier[] = [
  { id: 'monster',  label: 'モンスターボール級', steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'super',    label: 'スーパーボール級',   steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'hyper',    label: 'ハイパーボール級',   steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'master',   label: 'マスターボール級',   steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'champion', label: 'チャンピオン級',     steps: [] },
] as const;

export function getStepsForTier(id: RankTierId): readonly string[] {
  return RANKS.find(r => r.id === id)?.steps ?? [];
}
