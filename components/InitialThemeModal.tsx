'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { ThemeId } from '@/lib/types';

const THEMES: { id: ThemeId; label: string; desc: string }[] = [
  { id: 'official', label: 'ゲーム公式風', desc: 'トレーナーカード調・赤バー' },
  { id: 'retro',    label: 'レトロドット', desc: 'GB初代の液晶緑' },
  { id: 'starry',   label: '星空・月夜',   desc: '紺＋月のエレガント' },
];

export function InitialThemeModal() {
  const seen = useAppStore(s => s.hasSeenInitialModal);
  const mark = useAppStore(s => s.markInitialModalSeen);
  const setTheme = useAppStore(s => s.setTheme);
  // Use local state to directly control the dialog.
  // Base UI's Dialog does not reliably close in response to external `open` prop changes,
  // so we drive open/close via setOpen rather than relying on !seen.
  const [open, setOpen] = useState(!seen);

  const close = () => {
    setOpen(false);
    mark();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) close(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>デザインテーマを選んでください</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTheme(t.id); close(); }}
              className="text-left border rounded p-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="font-bold">{t.label}</div>
              <div className="text-xs text-neutral-500">{t.desc}</div>
            </button>
          ))}
        </div>
        <DialogFooter className="flex-col items-start gap-1">
          <Button variant="outline" onClick={close}>あとで決める</Button>
          <p className="text-xs text-neutral-400">テーマとフォントはヘッダーからいつでも変更できます</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
