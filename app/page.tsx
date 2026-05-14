'use client';
import { useRef } from 'react';
import { Form } from '@/components/Form';
import { Preview } from '@/components/Preview';
import { Footer } from '@/components/Footer';
import { ThemeSelector } from '@/components/Form/ThemeSelector';
import { InitialThemeModal } from '@/components/InitialThemeModal';

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">ポケチャン履歴書メーカー</h1>
        <ThemeSelector />
      </header>
      <div className="flex-1 md:grid md:grid-cols-2 md:gap-8 md:p-8">
        <div className="md:sticky md:top-8 md:self-start sticky top-0 z-10 bg-white p-4 md:p-0 border-b md:border-b-0 space-y-3">
          <Preview canvasRef={canvasRef} />
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
