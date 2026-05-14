'use client';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  required?: boolean;
  hint?: string;
  rows?: number;
};

export function TextareaField({ id, label, value, onChange, maxLength, required, hint, rows = 3 }: Props) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>
        {label}{required && <span className="text-red-500"> *</span>}
      </Label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      <Textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
      <p className="text-xs text-neutral-500">{value.length} / {maxLength}</p>
    </div>
  );
}
