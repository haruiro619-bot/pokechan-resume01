'use client';
import { useRef, useState } from 'react';
import { Form } from '@/components/Form';
import { Preview, PreviewCanvas } from '@/components/Preview';
import { Footer } from '@/components/Footer';
import { ThemeSelector } from '@/components/Form/ThemeSelector';
import { FontSelector } from '@/components/Form/FontSelector';
import { AccentSelector } from '@/components/Form/AccentSelector';
import { InitialThemeModal } from '@/components/InitialThemeModal';
import { DownloadButton } from '@/components/Export/DownloadButton';
import { ShareButton } from '@/components/Export/ShareButton';
import { MobilePreviewSheet } from '@/components/Preview/MobilePreviewSheet';

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      {/*
        export 専用キャンバス: 常に DOM に存在してキャプチャ可能な状態を保つ。
        viewport 左外に固定配置し視覚的には見えない。
        canvasRef はここだけに付与する（デスクトップ/モバイル共通）。
      */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: '-1200px',
          pointerEvents: 'none',
        }}
      >
        <PreviewCanvas ref={canvasRef} />
      </div>

      <header className="border-b px-6 py-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h1 className="text-xl font-bold flex-shrink-0">ポケチャン履歴書メーカー</h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">テーマ</span>
            <ThemeSelector />
          </div>
          <AccentSelector />
          <FontSelector />
          <p className="text-xs text-neutral-400">テーマ・フォントはここから変更できます</p>
        </div>
      </header>

      <div className="flex-1 md:grid md:grid-cols-2 md:gap-8 md:p-8">
        {/* デスクトップ専用: 左側プレビューパネル（現状のレイアウトを維持） */}
        <div className="hidden md:block md:sticky md:top-8 md:self-start space-y-3">
          {/* 表示専用 Preview（canvasRef なし） */}
          <Preview />
          <div className="flex gap-2">
            <DownloadButton canvasRef={canvasRef} />
            <ShareButton canvasRef={canvasRef} />
          </div>
        </div>

        {/* フォーム: モバイルでは全画面、デスクトップでは右側 */}
        {/* pb-24: 固定フッターボタンに隠れないようにモバイルでのみ下余白を追加 */}
        <div className="p-4 md:p-0 pb-24 md:pb-0">
          <Form />
        </div>
      </div>

      <Footer />
      <InitialThemeModal />

      {/* モバイル専用ボトムシート */}
      <MobilePreviewSheet
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        canvasRef={canvasRef}
      />

      {/* モバイル専用: 固定フッターボタン */}
      <div
        className="fixed bottom-0 inset-x-0 md:hidden z-40 bg-white/90 border-t px-4 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setPreviewOpen(true)}
          className="w-full rounded-xl py-3 font-bold text-white text-base"
          style={{ background: 'linear-gradient(90deg, #dc2626, #ef4444)' }}
        >
          👁 プレビューを見る
        </button>
      </div>
    </main>
  );
}
