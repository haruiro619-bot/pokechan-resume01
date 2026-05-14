'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';

const MAX = 20;

export function HandleInput() {
  const handle = useAppStore(s => s.form.handle);
  const updateForm = useAppStore(s => s.updateForm);
  return (
    <div className="space-y-1">
      <Label htmlFor="handle">ハンドルネーム <span className="text-red-500">*</span></Label>
      <Input
        id="handle"
        value={handle}
        maxLength={MAX}
        onChange={(e) => updateForm({ handle: e.target.value.slice(0, MAX) })}
      />
      <p className="text-xs text-neutral-500">{handle.length} / {MAX}</p>
    </div>
  );
}
