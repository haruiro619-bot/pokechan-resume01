'use client';
import { useRef } from 'react';
import { Form } from '@/components/Form';
import { Preview } from '@/components/Preview';
import { Footer } from '@/components/Footer';
import { ThemeSelector } from '@/components/Form/ThemeSelector';
import { FontSelector } from '@/components/Form/FontSelector';
import { InitialThemeModal } from '@/components/InitialThemeModal';
import { DownloadButton } from '@/components/Export/DownloadButton';
import { ShareButton } from '@/components/Export/ShareButton';

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h1 className="text-xl font-bold flex-shrink-0">ポケチャン履歴書メーカー</h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">テーマ</span>
            <ThemeSelector />
          </div>
          <FontSelector />
          <p className="text-xs text-neutral-400">テーマ・フォントはここから変更できます</p>
        </div>
      </header>
      <div className="flex-1 md:grid md:grid-cols-2 md:gap-8 md:p-8">
        <div className="md:sticky md:top-8 md:self-start sticky top-0 z-10 bg-white p-4 md:p-0 border-b md:border-b-0 space-y-3">
          <Preview canvasRef={canvasRef} />
          <div className="flex gap-2">
            <DownloadButton canvasRef={canvasRef} />
            <ShareButton canvasRef={canvasRef} />
          </div>
        </div>
        <div className="p-4 md:p-0">
          <Form />
        </div>
      </div>
      <Footer />
      <InitialThemeModal />
    </main>
  );
}
