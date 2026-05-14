'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportNodeToBlob } from '@/lib/image-export';
import { buildShareText, buildXIntentUrl, canUseWebShareWithFiles } from '@/lib/share';
import { useAppStore } from '@/lib/store';
import { buildFilename } from '@/lib/filename';
import { SITE_URL } from '@/lib/constants/site';

export function ShareButton({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const handle = useAppStore(s => s.form.handle);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!canvasRef.current) return;
    setBusy(true);
    try {
      const blob = await exportNodeToBlob(canvasRef.current);
      const text = buildShareText(`https://${SITE_URL}`);
      const file = new File([blob], buildFilename(handle), { type: 'image/png' });

      if (canUseWebShareWithFiles()) {
        await navigator.share({ files: [file], text });
        return;
      }
      // PCフォールバック: ダウンロード + X intent タブ
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      window.open(buildXIntentUrl(text), '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="secondary" onClick={onClick} disabled={busy} className="flex-1">
      {busy ? '生成中...' : 'Xでシェア'}
    </Button>
  );
}
