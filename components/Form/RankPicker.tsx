'use client';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RANKS, getStepsForTier, type RankTierId } from '@/lib/constants/ranks';

type Value = { tier: RankTierId; step: string | null } | null;

export function RankPicker({ value, onChange }: { value: Value; onChange: (v: Value) => void }) {
  const [internal, setInternal] = useState<Value>(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  const display = internal;
  const steps = display ? getStepsForTier(display.tier) : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="rank-tier">現在ランク</Label>
      <div className="flex gap-2">
        <select
          id="rank-tier"
          aria-label="級"
          className="border rounded px-2 py-1"
          value={display?.tier ?? ''}
          onChange={(e) => {
            const tier = e.target.value as RankTierId | '';
            if (!tier) {
              setInternal(null);
              return onChange(null);
            }
            const nextSteps = getStepsForTier(tier);
            const next: Value = { tier, step: nextSteps.length ? nextSteps[0] : null };
            setInternal(next);
            onChange(next);
          }}
        >
          <option value="">未選択</option>
          {RANKS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>

        {display && steps.length > 0 && (
          <select
            aria-label="段階"
            className="border rounded px-2 py-1"
            value={display.step ?? ''}
            onChange={(e) => {
              const next: Value = { tier: display.tier, step: e.target.value || null };
              setInternal(next);
              onChange(next);
            }}
          >
            {steps.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
