'use client';
import { useAppStore } from '@/lib/store';
import { FONTS } from '@/lib/constants/fonts';

const CATEGORIES = ['ベーシック', 'かわいい系', 'かっこいい系'] as const;

export function FontSelector() {
  const fontId  = useAppStore(s => s.fontId);
  const setFont = useAppStore(s => s.setFont);

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">フォント</p>
      {CATEGORIES.map(cat => {
        const fonts = FONTS.filter(f => f.categoryLabel === cat);
        return (
          <div key={cat}>
            <p className="text-xs font-bold text-neutral-400 mb-1">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {fonts.map(f => (
                <button
                  key={f.id}
                  type="button"
                  aria-label={f.label}
                  aria-pressed={fontId === f.id}
                  onClick={() => setFont(f.id)}
                  className={`px-3 py-1.5 rounded border text-sm transition-colors
                    ${fontId === f.id
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 hover:border-neutral-500 bg-white text-neutral-800'
                    }`}
                  style={{ fontFamily: f.cssVar }}
                >
                  {f.sample}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
