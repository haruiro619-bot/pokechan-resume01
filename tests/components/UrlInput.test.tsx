import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { UrlInput } from '@/components/Form/UrlInput';

function Wrapper() {
  const [value, setValue] = useState('');
  return <UrlInput value={value} onChange={setValue} />;
}

describe('UrlInput', () => {
  it('shows error for invalid URL', async () => {
    render(<Wrapper />);
    await userEvent.type(screen.getByLabelText(/配信/), 'not-a-url');
    expect(screen.getByText('http:// または https:// で始まる URL を入力してください')).toBeInTheDocument();
  });

  it('shows no error for valid https URL', async () => {
    render(<Wrapper />);
    await userEvent.type(screen.getByLabelText(/配信/), 'https://example.com');
    expect(screen.queryByText(/URL を入力/)).not.toBeInTheDocument();
  });

  it('shows no error for empty input', () => {
    render(<UrlInput value="" onChange={() => {}} />);
    expect(screen.queryByText(/URL を入力/)).not.toBeInTheDocument();
  });
});
