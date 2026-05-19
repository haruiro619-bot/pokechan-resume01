# Mobile Preview Bottom Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** モバイルでプレビューを常時表示するのをやめ、固定フッターボタン → ボトムシートの UX に切り替える。

**Architecture:**  
export 用キャンバスとディスプレイ用キャンバスを分離する。`page.tsx` に常時オフスクリーンの `<PreviewCanvas ref={canvasRef} />` を置いて export 専用とする。デスクトップ側パネルとモバイルボトムシートは `<Preview />` (ref なし) で表示専用描画のみ行う。これにより `canvasRef` は常に有効な DOM 要素を指し、`md:hidden` の display:none 問題を回避できる。

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS v4

---

## File Map

| ファイル | 変更 | 役割 |
|---|---|---|
| `components/Preview/index.tsx` | 変更 | `canvasRef` を optional に。ref なし呼び出しで表示専用として使えるようにする |
| `components/Preview/MobilePreviewSheet.tsx` | 新規作成 | モバイル専用ボトムシート。表示用 `<Preview />` + DownloadButton + ShareButton を内包 |
| `app/page.tsx` | 変更 | オフスクリーン export キャンバスを常時配置。デスクトップ/モバイルのレイアウトを振り分け |

---

## Task 1: `Preview` の `canvasRef` を optional に変更

**Files:**
- Modify: `components/Preview/index.tsx`

---

- [ ] **Step 1: `canvasRef` prop の型を optional に変更する**

`components/Preview/index.tsx` の `Preview` 関数シグネチャとキャンバス呼び出し部分を変更する。ファイル全体を以下に置き換える：

```tsx
'use client';
import { forwardRef, useRef, useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Official } from './themes/Official';
import { Retro } from './themes/Retro';
import { Starry } from './themes/Starry';
import { FONTS } from '@/lib/constants/fonts';
import { ACCENTS } from '@/lib/constants/accents';

export const PREVIEW_PX = 1080;

export const PreviewCanvas = forwardRef<HTMLDivElement>(function PreviewCanvas(_, ref) {
  const form = useAppStore(s => s.form);
  const themeId = useAppStore(s => s.themeId);
  const fontId = useAppStore(s => s.fontId);
  const accentId = useAppStore(s => s.accentId);
  const fontDef = FONTS.find(f => f.id === fontId) ?? FONTS[0];
  const accent = ACCENTS.find(a => a.id === accentId) ?? ACCENTS[0];
  return (
    <div
      ref={ref}
      style={{ width: PREVIEW_PX, height: PREVIEW_PX, fontFamily: fontDef.cssVar }}
      className="relative overflow-hidden"
    >
      {themeId === 'official' && <Official form={form} accent={accent} />}
      {themeId === 'retro' && <Retro form={form} />}
      {themeId === 'starry' && <Starry form={form} accent={accent} />}
    </div>
  );
});

// canvasRef は省略可能。省略時は表示専用（ref なし）として動作する。
export function Preview({ canvasRef }: { canvasRef?: React.RefObject<HTMLDivElement | null> }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / PREVIEW_PX);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section aria-label="プレビュー" className="w-full max-w-[540px] mx-auto">
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden border rounded"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <PreviewCanvas ref={canvasRef ?? null} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: ビルドが通ることを確認**

```bash
npm run build
```

期待結果: `✓ Compiled successfully` 。TypeScript エラーなし。

- [ ] **Step 3: コミット**

```bash
git add components/Preview/index.tsx
git commit -m "refactor: make canvasRef optional in Preview for display-only usage"
```

---

## Task 2: `MobilePreviewSheet` コンポーネントを新規作成

**Files:**
- Create: `components/Preview/MobilePreviewSheet.tsx`

---

- [ ] **Step 1: ファイルを作成する**

`MobilePreviewSheet` は表示専用の `<Preview />` (canvasRef なし) と、export 用 canvasRef を受け取ってボタンに渡す。

```tsx
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
```

- [ ] **Step 2: ビルドが通ることを確認**

```bash
npm run build
```

期待結果: `✓ Compiled successfully` 。TypeScript エラーなし。

- [ ] **Step 3: コミット**

```bash
git add components/Preview/MobilePreviewSheet.tsx
git commit -m "feat: add MobilePreviewSheet bottom sheet component"
```

---

## Task 3: `page.tsx` のレイアウトを再編

**Files:**
- Modify: `app/page.tsx`

---

- [ ] **Step 1: `page.tsx` を以下の内容に置き換える**

設計のポイント:
- `<PreviewCanvas ref={canvasRef} />` をオフスクリーン fixed div に常時配置 → デスクトップ/モバイル問わず `canvasRef.current` が常に有効
- デスクトップ側パネルの `<Preview />` は ref なし（表示専用）
- `MobilePreviewSheet` は `md:hidden` で desktop では非表示だが canvasRef は上記オフスクリーンが保持するため問題なし

```tsx
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
```

- [ ] **Step 2: ビルドが通ることを確認**

```bash
npm run build
```

期待結果: `✓ Compiled successfully` 。TypeScript エラーなし。

- [ ] **Step 3: コミット**

```bash
git add app/page.tsx
git commit -m "feat: mobile preview bottom sheet - replace sticky preview with fixed button and sheet"
```

---

## Task 4: 動作確認

- [ ] **Step 1: 開発サーバーを起動**

```bash
npm run dev
```

- [ ] **Step 2: モバイル表示を確認（ブラウザ DevTools → モバイルエミュレーション）**

確認項目:
- [ ] フォームが全画面表示される（上部にプレビューが表示されていない）
- [ ] 画面下部に「👁 プレビューを見る」ボタンが固定表示される
- [ ] ボタンタップでボトムシートがスライドアップする
- [ ] シート内にプレビューが正しく表示される
- [ ] 「PNGをダウンロード」「Xでシェア」ボタンが機能する（PNG が正しく生成される）
- [ ] × ボタン / 背景タップでシートが閉じる
- [ ] フォームに入力するとプレビューに反映される（シートを開いて確認）

- [ ] **Step 3: デスクトップ表示を確認**

確認項目:
- [ ] 左側プレビュー + 右側フォームのレイアウトが維持されている
- [ ] 「PNGをダウンロード」「Xでシェア」ボタンがプレビュー下に表示される
- [ ] 固定フッターボタンが表示されていない
- [ ] テーマ / アクセント / フォント変更が正常に動作する

- [ ] **Step 4: git push**

```bash
git push origin main
```
