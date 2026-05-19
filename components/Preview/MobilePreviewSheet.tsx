'use client';
import { Preview } from './index';
import { DownloadButton } from '@/components/Export/DownloadButton';
import { ShareButton } from '@/components/Export/ShareButton';

interface Props {
  open: boolean;
  onClose: () => void;
  // export 専用キャンバスへの ref（DownloadButton/ShareButton に渡すだけ。表示には使わない）
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function MobilePreviewSheet({ open, onClose, canvasRef }: Props) {
  return (
    // md:hidden — デスクトップでは display:none になるが、
    // canvasRef は page.tsx のオフスクリーンキャンバスが保持するため問題なし
    <div
      className="fixed inset-0 z-50 md:hidden"
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{
          opacity: open ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
        aria-hidden
      />

      {/* シート本体 */}
      <div
        className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl flex flex-col"
        style={{
          maxHeight: '95dvh',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* ドラッグハンドル（装飾のみ） */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* ヘッダー行 */}
        <div className="relative flex items-center justify-center px-4 py-2 flex-shrink-0">
          <span className="text-sm font-semibold text-neutral-700">プレビュー</span>
          <button
            onClick={onClose}
            className="absolute right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 text-lg leading-none"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* コンテンツ（スクロール可能） */}
        <div
          className="flex-1 overflow-y-auto px-4"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          {/* 表示専用プレビュー（canvasRef なし） */}
          <Preview />
          <div className="flex gap-2 mt-3">
            {/* canvasRef はオフスクリーンの export キャンバスを指す */}
            <DownloadButton canvasRef={canvasRef} />
            <ShareButton canvasRef={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
