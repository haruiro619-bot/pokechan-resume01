'use client';
import { useAppStore } from '@/lib/store';
import { ACCENTS } from '@/lib/constants/accents';

export function AccentSelector() {
  const themeId = useAppStore(s => s.themeId);
  const accentId = useAppStore(s => s.accentId);
  const setAccent = useAppStore(s => s.setAccent);

  if (themeId !== 'official' && themeId !== 'starry') return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500">アクセント</span>
      <div className="flex gap-1.5">
        {ACCENTS.map(a => (
          <button
            key={a.id}
            type="button"
            title={a.label}
            aria-pressed={accentId === a.id}
            onClick={() => setAccent(a.id)}
            className="w-5 h-5 rounded-full transition-transform hover:scale-110"
            style={{
              background: a.primary,
              boxShadow: accentId === a.id ? `0 0 0 2px white, 0 0 0 3.5px ${a.primary}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
