'use client';
import { Label } from '@/components/ui/label';
import { RULES, type Rule } from '@/lib/constants/rules';

export function RuleCheckboxes({ value, onChange }: { value: Rule[]; onChange: (v: Rule[]) => void }) {
  const toggle = (r: Rule) =>
    onChange(value.includes(r) ? value.filter(x => x !== r) : [...value, r]);
  return (
    <div className="space-y-1">
      <Label>好きなルール</Label>
      <div className="flex gap-4">
        {RULES.map(r => (
          <label key={r} className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={value.includes(r)} onChange={() => toggle(r)} />
            <span>{r}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
