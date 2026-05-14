'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';

export function ResetButton() {
  const reset = useAppStore(s => s.resetForm);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        入力をリセット
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>入力をすべて削除しますか？</DialogTitle></DialogHeader>
          <p className="text-sm text-neutral-600">
            ハンドル・推し・コメント等の入力内容が初期化されます。テーマ設定は保持されます。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => { reset(); setOpen(false); }}
            >
              リセット
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
