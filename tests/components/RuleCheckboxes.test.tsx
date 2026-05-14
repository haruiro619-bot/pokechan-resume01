import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RuleCheckboxes } from '@/components/Form/RuleCheckboxes';

describe('RuleCheckboxes', () => {
  it('toggles values', async () => {
    let v: ('シングル' | 'ダブル')[] = [];
    const { rerender } = render(<RuleCheckboxes value={v} onChange={(x) => { v = x; }} />);
    await userEvent.click(screen.getByLabelText('シングル'));
    rerender(<RuleCheckboxes value={v} onChange={(x) => { v = x; }} />);
    expect(v).toEqual(['シングル']);
    await userEvent.click(screen.getByLabelText('ダブル'));
    rerender(<RuleCheckboxes value={v} onChange={(x) => { v = x; }} />);
    expect(v).toEqual(['シングル', 'ダブル']);
    await userEvent.click(screen.getByLabelText('シングル'));
    expect(v).toEqual(['ダブル']);
  });
});
