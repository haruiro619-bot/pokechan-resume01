import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { PresetChipInput } from '@/components/Form/PresetChipInput';

function Wrapper({ presets }: { presets: readonly string[] }) {
  const [value, setValue] = useState('');
  return (
    <PresetChipInput
      id="ph"
      label="プレイ歴"
      presets={presets}
      value={value}
      onChange={setValue}
      maxLength={20}
    />
  );
}

describe('PresetChipInput', () => {
  it('fills the text input when a preset chip is clicked', async () => {
    render(<Wrapper presets={['A', 'B']} />);
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(screen.getByLabelText('プレイ歴')).toHaveValue('A');
  });

  it('allows free typing', async () => {
    render(<Wrapper presets={['A', 'B']} />);
    await userEvent.type(screen.getByLabelText('プレイ歴'), 'カスタム');
    expect(screen.getByLabelText('プレイ歴')).toHaveValue('カスタム');
  });
});
