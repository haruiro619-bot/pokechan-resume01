import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HandleInput } from '@/components/Form/HandleInput';
import { useAppStore } from '@/lib/store';
import { INITIAL_FORM } from '@/lib/types';

describe('HandleInput', () => {
  beforeEach(() => {
    useAppStore.setState({ form: { ...INITIAL_FORM } });
  });

  it('writes typed value into store', async () => {
    render(<HandleInput />);
    await userEvent.type(screen.getByLabelText(/ハンドルネーム/), 'タロウ');
    expect(useAppStore.getState().form.handle).toBe('タロウ');
  });

  it('clamps input to 20 characters', async () => {
    render(<HandleInput />);
    await userEvent.type(screen.getByLabelText(/ハンドルネーム/), 'あ'.repeat(25));
    expect(useAppStore.getState().form.handle.length).toBe(20);
  });
});
