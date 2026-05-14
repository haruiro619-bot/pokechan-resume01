'use client';
import { useState, useEffect } from 'react';
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
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value.slice(0, maxLength);
    setInternal(next);
    onChange(next);
  }

  return (
    <div className="space-y-1">
      <Label htmlFor={id}>
        {label}{required && <span className="text-red-500"> *</span>}
      </Label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      <Textarea
        id={id}
        rows={rows}
        value={internal}
        maxLength={maxLength}
        onChange={handleChange}
      />
      <p className="text-xs text-neutral-500">{internal.length} / {maxLength}</p>
    </div>
  );
}
