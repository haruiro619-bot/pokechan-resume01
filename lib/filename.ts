function pad(n: number) { return n.toString().padStart(2, '0'); }

export function buildFilename(handle: string, now: Date = new Date()): string {
  const safe = handle.replace(/[\\/?*:<>|"]/g, '').trim() || 'anonymous';
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `pokechan-resume-${safe}-${y}${m}${d}-${hh}${mm}${ss}.png`;
}
