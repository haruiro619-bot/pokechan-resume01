'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function isValidHttpUrl(v: string): boolean {
  if (!v) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function UrlInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const invalid = value.length > 0 && !isValidHttpUrl(value);
  return (
    <div className="space-y-1">
      <Label htmlFor="snsLink">配信 / 他SNSリンク</Label>
      <Input
        id="snsLink"
        type="url"
        placeholder="https://..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {invalid && (
        <p className="text-xs text-red-500">http:// または https:// で始まる URL を入力してください</p>
      )}
    </div>
  );
}
