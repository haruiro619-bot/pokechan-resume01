'use client';
import { forwardRef, useRef, useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Official } from './themes/Official';
import { Retro } from './themes/Retro';
import { Starry } from './themes/Starry';
import { FONTS } from '@/lib/constants/fonts';
import { ACCENTS } from '@/lib/constants/accents';

export const PREVIEW_PX = 1080;

export const PreviewCanvas = forwardRef<HTMLDivElement>(function PreviewCanvas(_, ref) {
  const form = useAppStore(s => s.form);
  const themeId = useAppStore(s => s.themeId);
  const fontId = useAppStore(s => s.fontId);
  const accentId = useAppStore(s => s.accentId);
  const fontDef = FONTS.find(f => f.id === fontId) ?? FONTS[0];
  const accent = ACCENTS.find(a => a.id === accentId) ?? ACCENTS[0];
  return (
    <div
      ref={ref}
      style={{ width: PREVIEW_PX, height: PREVIEW_PX, fontFamily: fontDef.cssVar }}
      className="relative overflow-hidden"
    >
      {themeId === 'official' && <Official form={form} accent={accent} />}
      {themeId === 'retro' && <Retro form={form} />}
      {themeId === 'starry' && <Starry form={form} accent={accent} />}
    </div>
  );
});

// canvasRef は省略可能。省略時は表示専用（ref なし）として動作する。
export function Preview({ canvasRef }: { canvasRef?: React.RefObject<HTMLDivElement | null> }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / PREVIEW_PX);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section aria-label="プレビュー" className="w-full max-w-[540px] mx-auto">
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden border rounded"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <PreviewCanvas ref={canvasRef ?? null} />
        </div>
      </div>
    </section>
  );
}
