import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RankPicker } from '@/components/Form/RankPicker';

describe('RankPicker', () => {
  it('shows step selector for non-champion tier', async () => {
    let v: any = null;
    render(<RankPicker value={v} onChange={(x) => { v = x; }} />);
    await userEvent.selectOptions(screen.getByLabelText('級'), 'hyper');
    expect(screen.getByLabelText('段階')).toBeInTheDocument();
  });

  it('hides step selector for champion tier and sets step to null', async () => {
    let v: any = null;
    const { rerender } = render(<RankPicker value={v} onChange={(x) => { v = x; }} />);
    await userEvent.selectOptions(screen.getByLabelText('級'), 'champion');
    rerender(<RankPicker value={v} onChange={(x) => { v = x; }} />);
    expect(v).toEqual({ tier: 'champion', step: null });
    expect(screen.queryByLabelText('段階')).not.toBeInTheDocument();
  });
});
