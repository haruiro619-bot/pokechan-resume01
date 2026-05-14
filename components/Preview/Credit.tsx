import { SITE_URL } from '@/lib/constants/site';

export function Credit({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute bottom-3 right-4 text-[10px] opacity-70 ${className}`}>
      {SITE_URL}
    </div>
  );
}
