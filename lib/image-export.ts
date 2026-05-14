import { toBlob, toPng } from 'html-to-image';

const WIDTH = 1080;
const HEIGHT = 1080;
const PIXEL_RATIO = 2;

export async function exportNodeToPng(node: HTMLElement): Promise<string> {
  return await toPng(node, { width: WIDTH, height: HEIGHT, pixelRatio: PIXEL_RATIO, cacheBust: true });
}

export async function exportNodeToBlob(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, { width: WIDTH, height: HEIGHT, pixelRatio: PIXEL_RATIO, cacheBust: true });
  if (!blob) throw new Error('PNG blob generation failed');
  return blob;
}
