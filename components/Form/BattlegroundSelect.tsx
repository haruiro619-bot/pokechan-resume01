'use client';
import { Label } from '@/components/ui/label';
import { BATTLEGROUNDS, type Battleground } from '@/lib/constants/battlegrounds';

export function BattlegroundSelect({
  value,
  onChange,
}: {
  value: Battleground | null;
  onChange: (v: Battleground | null) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor="bg">主戦場</Label>
      <select
        id="bg"
        className="border rounded px-2 py-1"
        value={value ?? ''}
        onChange={(e) => onChange((e.target.value || null) as Battleground | null)}
      >
        <option value="">未選択</option>
        {BATTLEGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
  );
}
