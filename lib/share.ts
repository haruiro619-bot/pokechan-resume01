import { HASHTAG, SITE_URL } from './constants/site';

export function buildShareText(siteUrl: string): string {
  return `ポケチャン履歴書を作りました！\n${HASHTAG}\n${siteUrl}`;
}

export function buildXIntentUrl(text: string): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function canUseWebShareWithFiles(): boolean {
  if (typeof navigator === 'undefined') return false;
  try {
    return (
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [new File([new Blob(['x'])], 't.png', { type: 'image/png' })] })
    );
  } catch {
    return false;
  }
}
