export const RULES = ['シングル', 'ダブル'] as const;
export type Rule = (typeof RULES)[number];
