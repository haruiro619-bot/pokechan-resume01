'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  id: string;
  label: string;
  presets: readonly string[];
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
};

export function PresetChipInput({ id, label, presets, value, onChange, maxLength }: Props) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap gap-1">
        {presets.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="text-xs px-2 py-1 border rounded hover:bg-neutral-100"
          >
            {p}
          </button>
        ))}
      </div>
      <Input
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
    </div>
  );
}
