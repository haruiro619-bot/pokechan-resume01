import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TextareaField } from '@/components/Form/TextareaField';

function Wrapper({ maxLength }: { maxLength: number }) {
  const [value, setValue] = useState('');
  return (
    <TextareaField
      id="t"
      label="テスト"
      value={value}
      onChange={setValue}
      maxLength={maxLength}
    />
  );
}

describe('TextareaField', () => {
  it('calls onChange with input value', async () => {
    render(<Wrapper maxLength={10} />);
    await userEvent.type(screen.getByLabelText('テスト'), 'ハロー');
    expect(screen.getByLabelText('テスト')).toHaveValue('ハロー');
  });

  it('shows char counter respecting maxLength', () => {
    render(
      <TextareaField id="t" label="テスト" value="あいう" onChange={() => {}} maxLength={10} />
    );
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });
});
