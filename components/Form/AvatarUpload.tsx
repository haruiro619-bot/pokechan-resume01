'use client';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { fileToDataUrl, cropDataUrl } from '@/lib/image-crop';

const MAX_BYTES = 5 * 1024 * 1024;

export function AvatarUpload() {
  const iconDataUrl = useAppStore(s => s.form.iconDataUrl);
  const updateForm = useAppStore(s => s.updateForm);

  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const onPick = useCallback(async (file: File) => {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError('5MB以下の画像をアップロードしてください');
      return;
    }
    if (!/^image\/(png|jpe?g)$/.test(file.type)) {
      setError('JPG または PNG のみアップロード可能です');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setEditing(dataUrl);
    setCropPos({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const onConfirm = useCallback(async () => {
    if (!editing) return;
    const cropRect = areaPx
      ? { x: areaPx.x, y: areaPx.y, size: areaPx.width }
      : { x: 0, y: 0, size: 512 };
    const cropped = await cropDataUrl(editing, cropRect);
    updateForm({ iconDataUrl: cropped });
    setEditing(null);
  }, [editing, areaPx, updateForm]);

  return (
    <div className="space-y-2">
      <Label>アイコン画像 <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-3">
        {iconDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconDataUrl} alt="" className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-neutral-200 border" />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>正方形にトリミング</DialogTitle></DialogHeader>
          <div className="relative w-full h-64 bg-black">
            {editing && (
              <Cropper
                image={editing}
                crop={cropPos}
                zoom={zoom}
                aspect={1}
                onCropChange={setCropPos}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setAreaPx(area)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>キャンセル</Button>
            <Button onClick={onConfirm}>確定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
