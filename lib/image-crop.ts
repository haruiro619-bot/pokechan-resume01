export function computeSquareCrop(
  imgW: number,
  imgH: number,
  centerX: number,
  centerY: number,
  zoom: number,
): { x: number; y: number; size: number } {
  const baseSize = Math.min(imgW, imgH);
  const size = Math.max(1, Math.round(baseSize / Math.max(zoom, 1)));
  const cx = Math.round(imgW * centerX);
  const cy = Math.round(imgH * centerY);
  const x = Math.min(Math.max(0, cx - Math.floor(size / 2)), imgW - size);
  const y = Math.min(Math.max(0, cy - Math.floor(size / 2)), imgH - size);
  return { x, y, size };
}

export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function cropDataUrl(
  dataUrl: string,
  crop: { x: number; y: number; size: number },
  outSize = 512,
): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(); });
  const canvas = document.createElement('canvas');
  canvas.width = outSize;
  canvas.height = outSize;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, crop.x, crop.y, crop.size, crop.size, 0, 0, outSize, outSize);
  return canvas.toDataURL('image/png');
}
