import { describe, it, expect, vi } from 'vitest';
import * as htmlToImage from 'html-to-image';
import { exportNodeToPng } from '@/lib/image-export';

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,XXX'),
  toBlob: vi.fn().mockResolvedValue(new Blob(['x'], { type: 'image/png' })),
}));

describe('exportNodeToPng', () => {
  it('calls toPng with pixelRatio 2 and 1080×1080', async () => {
    const node = document.createElement('div');
    const url = await exportNodeToPng(node);
    expect(url).toBe('data:image/png;base64,XXX');
    expect(htmlToImage.toPng).toHaveBeenCalledWith(node, expect.objectContaining({
      pixelRatio: 2,
      width: 1080,
      height: 1080,
    }));
  });
});
