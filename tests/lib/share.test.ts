import { describe, it, expect } from 'vitest';
import { buildShareText, buildXIntentUrl } from '@/lib/share';

describe('share', () => {
  it('buildShareText includes hashtag and url', () => {
    const text = buildShareText('https://example.com');
    expect(text).toContain('#ポケチャン履歴書');
    expect(text).toContain('https://example.com');
    expect(text).toContain('ポケチャン履歴書を作りました！');
  });
  it('buildXIntentUrl encodes the text', () => {
    const url = buildXIntentUrl('hello #tag');
    expect(url).toBe('https://x.com/intent/tweet?text=hello%20%23tag');
  });
});
