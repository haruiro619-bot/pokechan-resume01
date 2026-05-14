import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextareaField } from '@/components/Form/TextareaField';

describe('TextareaField', () => {
  it('calls onChange with input value', async () => {
    let value = '';
    render(
      <TextareaField
        id="t"
        label="テスト"
        value={value}
        onChange={(v) => { value = v; }}
        maxLength={10}
      />
    );
    await userEvent.type(screen.getByLabelText('テスト'), 'ハロー');
    expect(value).toBe('ハロー');
  });

  it('shows char counter respecting maxLength', () => {
    render(
      <TextareaField id="t" label="テスト" value="あいう" onChange={() => {}} maxLength={10} />
    );
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });
});
