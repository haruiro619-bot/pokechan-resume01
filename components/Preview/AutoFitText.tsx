'use client';
import { useRef, useLayoutEffect } from 'react';

interface Props {
  text: string;
  maxSize: number;
  minSize: number;
  /** 改行を保持して複数行表示する場合 true */
  multiline?: boolean;
  /** multiline=true 時に使う縦の上限 (px) */
  availableHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AutoFitText({ text, maxSize, minSize, multiline = false, availableHeight, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.fontSize = `${maxSize}px`;

    const fits = () =>
      multiline && availableHeight !== undefined
        ? el.scrollHeight <= availableHeight
        : el.scrollWidth <= el.clientWidth;

    if (fits()) return;
    let lo = minSize, hi = maxSize - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;
      if (fits()) lo = mid;
      else hi = mid - 1;
    }
  }, [text, maxSize, minSize, multiline, availableHeight]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, fontSize: maxSize, whiteSpace: multiline ? 'pre-line' : 'nowrap', overflow: 'hidden' }}
    >
      {text}
    </div>
  );
}
