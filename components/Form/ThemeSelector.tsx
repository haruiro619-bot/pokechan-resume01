'use client';
import { useAppStore } from '@/lib/store';
import type { ThemeId } from '@/lib/types';

const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'official', label: 'ゲーム公式風' },
  { id: 'retro',    label: 'レトロドット' },
  { id: 'starry',   label: '星空・月夜' },
];

export function ThemeSelector() {
  const themeId = useAppStore(s => s.themeId);
  const setTheme = useAppStore(s => s.setTheme);
  return (
    <select
      aria-label="テーマ切替"
      className="border rounded px-2 py-1 text-sm"
      value={themeId}
      onChange={(e) => setTheme(e.target.value as ThemeId)}
    >
      {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
    </select>
  );
}
