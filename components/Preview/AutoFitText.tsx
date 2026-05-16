'use client';
import { useRef, useLayoutEffect } from 'react';

interface Props {
  text: string;
  maxSize: number;
  minSize: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AutoFitText({ text, maxSize, minSize, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.fontSize = `${maxSize}px`;
    if (el.scrollWidth <= el.clientWidth) return;
    // binary search for the largest size that fits
    let lo = minSize, hi = maxSize - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;
      if (el.scrollWidth <= el.clientWidth) lo = mid;
      else hi = mid - 1;
    }
  }, [text, maxSize, minSize]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, fontSize: maxSize, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {text}
    </div>
  );
}
