'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { exportNodeToPng } from '@/lib/image-export';
import { buildFilename } from '@/lib/filename';

export function DownloadButton({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const handle = useAppStore(s => s.form.handle);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!canvasRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await exportNodeToPng(canvasRef.current);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = buildFilename(handle);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={busy} className="flex-1">
      {busy ? '生成中...' : 'PNGをダウンロード'}
    </Button>
  );
}
