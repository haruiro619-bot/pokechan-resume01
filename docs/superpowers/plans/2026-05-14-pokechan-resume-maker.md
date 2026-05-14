# ポケチャン履歴書メーカー 実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ポケモンチャンピオンズの自己紹介画像（履歴書）をブラウザ上で作成し、X (旧Twitter) に「#ポケチャン履歴書」付きで共有できるシングルページ Web ツールを実装する。

**Architecture:** Next.js (App Router) + TypeScript + Tailwind の完全クライアントサイド SPA。Zustand で入力状態をグローバル管理し `localStorage` に自動保存。プレビュー DOM を html-to-image で 2160×2160 PNG に書き出し、Web Share API / X intent で共有する。サーバーには一切保存しない。

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand (+persist middleware), html-to-image, react-easy-crop, Vitest + React Testing Library + jsdom, Vercel hosting.

---

## 1. ファイル構造（実装後の最終形）

```
data/
├─ pokemon-pokechan.json         # 内定211件（カタカナ文字列の配列）
└─ pokemon-all.json              # 全1050件

scripts/
└─ generate-pokemon-data.ts      # 同梱txt→jsonの一回限り変換スクリプト

lib/
├─ types.ts                      # ResumeForm, ThemeId, AppState
├─ store.ts                      # Zustand + persist（iconDataUrl除外）
├─ image-export.ts               # html-to-image ラッパ
├─ share.ts                      # 共有挙動（Web Share / X intent）
├─ filename.ts                   # ダウンロードファイル名生成
└─ constants/
   ├─ ranks.ts                   # ランク階層定義
   ├─ rules.ts                   # シングル / ダブル
   ├─ battlegrounds.ts           # ランクマッチ / フレンド戦 / 大会 / その他
   ├─ presets.ts                 # プレイ歴・バトルスタイルのチップ候補
   └─ pokemon.ts                 # JSON 読み込みヘルパー

app/
├─ layout.tsx                    # 全体レイアウト
├─ page.tsx                      # トップページ（Form + Preview）
└─ globals.css                   # Tailwind base

components/
├─ ui/                           # shadcn/ui 生成物（button, input, ...）
├─ Form/
│  ├─ index.tsx                  # フォーム本体（各フィールドを束ねる）
│  ├─ HandleInput.tsx
│  ├─ AvatarUpload.tsx           # アップロード+正方形クロップ
│  ├─ PokemonPicker.tsx          # 211/1050切替・検索・チップ選択
│  ├─ PokemonPickerField.tsx     # フォームフィールドラッパ（推し/バトル推し/並び）
│  ├─ CommentInput.tsx
│  ├─ RankPicker.tsx
│  ├─ RuleCheckboxes.tsx
│  ├─ BattlegroundSelect.tsx
│  ├─ PresetChipInput.tsx        # プレイ歴 / バトルスタイル共通
│  ├─ UrlInput.tsx
│  ├─ TextareaField.tsx          # 一言/つながりたい/活動者 共通
│  ├─ ResetButton.tsx
│  └─ ThemeSelector.tsx
├─ Preview/
│  ├─ index.tsx                  # プレビュー枠（テーマを切替）
│  ├─ Credit.tsx                 # 右下クレジット
│  └─ themes/
│     ├─ Official.tsx
│     ├─ Retro.tsx
│     └─ Starry.tsx
├─ Export/
│  ├─ DownloadButton.tsx
│  └─ ShareButton.tsx
├─ InitialThemeModal.tsx
└─ Footer.tsx                    # 免責・クレジット

tests/                           # Vitest テスト（実装ファイルと対応）
├─ lib/
├─ components/
└─ scripts/
```

---

## 2. 進め方ルール

- **TDD**: 各タスクは「失敗するテストを書く → 実行して失敗を確認 → 最小実装 → 実行してパス → コミット」の流れを守る
- **YAGNI**: 仕様にない機能は実装しない（カラーバリエ、第4テーマ、タイプ色バッジ等）
- **コミット粒度**: 各タスク完了で1コミット（タスク内テスト＋実装をひとまとめ）
- **コミットメッセージ**: Conventional Commits（`feat:`, `chore:`, `test:`, `docs:`）
- **shadcn/ui**: 必要なコンポーネントのみ `npx shadcn add` で個別追加（YAGNI）
- **テスト範囲**: 純関数とロジック中心。html-to-image / Web Share API はモックして呼び出し検証。ビジュアルは手動確認
- **言語**: コード内コメントは原則無し（命名で意図が伝わるなら不要）。UI 文言は日本語

---

### Task 1: Next.js + TypeScript プロジェクト初期化

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.eslintrc.json`, `.gitignore`（既存に追記）

- [ ] **Step 1: Next.js + TS + Tailwind の雛形を生成**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack
```
プロンプトはすべてデフォルトで応答。既存ファイル（`docs/`, `ポケモンリスト*.txt`, `.gitignore`）は保持する。

- [ ] **Step 2: 動作確認**

Run:
```bash
npm run dev
```
Expected: `http://localhost:3000` に Next.js のデフォルトページが表示される。確認できたら `Ctrl+C` で停止。

- [ ] **Step 3: トップページを空のプレースホルダに置き換え**

`app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">ポケチャン履歴書メーカー</h1>
    </main>
  );
}
```

`app/layout.tsx` の `<html>` の lang を `ja` に変更:
```tsx
<html lang="ja">
```

- [ ] **Step 4: ビルド確認**

Run: `npm run build`
Expected: エラーなく完了する。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind project"
```

---

### Task 2: テスト環境（Vitest + React Testing Library + jsdom）整備

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/sanity.test.ts`
- Modify: `package.json`（scripts追加）, `tsconfig.json`（types追加）

- [ ] **Step 1: 依存追加**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Vitest 設定を作成**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: tsconfig と package.json に追記**

`tsconfig.json` の `compilerOptions.types` に追加:
```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

`package.json` の `scripts` に追加:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: サニティテストを書く**

`tests/sanity.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: 実行して通ることを確認**

Run: `npm test`
Expected: 1 passed

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "chore: set up Vitest + React Testing Library"
```

---

### Task 3: shadcn/ui と追加ランタイム依存の導入

**Files:**
- Create: `components.json`, `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/checkbox.tsx`, `components/ui/dialog.tsx`, `components/ui/label.tsx`
- Modify: `package.json`

- [ ] **Step 1: shadcn 初期化**

Run:
```bash
npx shadcn@latest init -d
```
プロンプトはデフォルト（New York / Slate / CSS variables）。

- [ ] **Step 2: 必要な shadcn コンポーネントを追加**

Run:
```bash
npx shadcn@latest add button input textarea checkbox dialog label
```

- [ ] **Step 3: ランタイム依存を追加**

Run:
```bash
npm install zustand html-to-image react-easy-crop
```

- [ ] **Step 4: 一つだけ使って動作確認**

`app/page.tsx` で `Button` を import して描画:
```tsx
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">ポケチャン履歴書メーカー</h1>
      <Button>テスト</Button>
    </main>
  );
}
```

Run: `npm run build`
Expected: ビルド成功。

- [ ] **Step 5: ボタンを撤去（プレースホルダはhead見出しのみ）**

`app/page.tsx` から `<Button>` と import を削除。

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "chore: install shadcn/ui base components and runtime deps"
```

---

### Task 4: ポケモンデータ JSON 生成スクリプト

**Files:**
- Create: `scripts/generate-pokemon-data.ts`, `tests/scripts/generate-pokemon-data.test.ts`, `data/pokemon-pokechan.json`, `data/pokemon-all.json`
- Modify: `package.json`

- [ ] **Step 1: 失敗するテストを書く**

`tests/scripts/generate-pokemon-data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parsePokemonList } from '@/scripts/generate-pokemon-data';

describe('parsePokemonList', () => {
  it('strips whitespace and removes empties and duplicates while preserving order', () => {
    const input = 'フシギバナ\r\nリザードン\n\nリザードン\n  カメックス  \n';
    expect(parsePokemonList(input)).toEqual(['フシギバナ', 'リザードン', 'カメックス']);
  });

  it('returns an empty array for empty input', () => {
    expect(parsePokemonList('')).toEqual([]);
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `npm test -- generate-pokemon-data`
Expected: FAIL（モジュール未定義）

- [ ] **Step 3: スクリプトを実装**

`scripts/generate-pokemon-data.ts`:
```ts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

export function parsePokemonList(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const name = line.trim();
    if (!name) continue;
    if (seen.has(name)) continue;
    seen.add(name);
    result.push(name);
  }
  return result;
}

function main() {
  const root = resolve(__dirname, '..');
  const sources: Array<{ src: string; dest: string }> = [
    { src: 'ポケモンリスト(ポケチャン内定のみ).txt', dest: 'data/pokemon-pokechan.json' },
    { src: 'ポケモンリスト(全ポケモン).txt', dest: 'data/pokemon-all.json' },
  ];
  // 全角括弧版にもフォールバック
  const fallbacks: Record<string, string> = {
    'ポケモンリスト(ポケチャン内定のみ).txt': 'ポケモンリスト(ポケチャン内定のみ).txt',
    'ポケモンリスト(全ポケモン).txt': 'ポケモンリスト(全ポケモン).txt',
  };
  void fallbacks;
  mkdirSync(resolve(root, 'data'), { recursive: true });
  for (const { src, dest } of sources) {
    const candidates = [src, src.replace('(', '(').replace(')', ')')];
    let raw: string | null = null;
    for (const c of candidates) {
      try {
        raw = readFileSync(resolve(root, c), 'utf8');
        break;
      } catch { /* try next */ }
    }
    if (raw == null) throw new Error(`source not found for ${dest}`);
    const list = parsePokemonList(raw);
    writeFileSync(resolve(root, dest), JSON.stringify(list, null, 2) + '\n', 'utf8');
    // eslint-disable-next-line no-console
    console.log(`${dest}: ${list.length} entries`);
  }
}

if (require.main === module) main();
```

注: 同梱の txt ファイル名は全角括弧（`（` `）`）を含む。リテラルのコピペ時に環境差でハーフ幅になるとロード失敗するため、上記のように両候補を試す。

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- generate-pokemon-data`
Expected: 2 passed

- [ ] **Step 5: package.json にスクリプトを追加して実行**

`package.json` の `scripts` に追加:
```json
"data:generate": "tsx scripts/generate-pokemon-data.ts"
```

`tsx` を devDependency に追加:
```bash
npm install -D tsx
```

Run: `npm run data:generate`
Expected: `data/pokemon-pokechan.json: 211 entries` / `data/pokemon-all.json: 1050 entries`

- [ ] **Step 6: 行数を確認**

`data/pokemon-pokechan.json` と `data/pokemon-all.json` を開き、配列要素数がそれぞれ 211 / 1050 であることを確認。

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "feat: generate pokemon data JSON from source lists"
```

---

### Task 5: 定数モジュール（ranks / rules / battlegrounds / presets）

**Files:**
- Create: `lib/constants/ranks.ts`, `lib/constants/rules.ts`, `lib/constants/battlegrounds.ts`, `lib/constants/presets.ts`, `tests/lib/constants/ranks.test.ts`

- [ ] **Step 1: ranks のテストを書く**

`tests/lib/constants/ranks.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { RANKS, getStepsForTier } from '@/lib/constants/ranks';

describe('RANKS', () => {
  it('contains 5 tiers in correct order', () => {
    expect(RANKS.map(r => r.id)).toEqual([
      'monster', 'super', 'hyper', 'master', 'champion',
    ]);
  });

  it('non-champion tiers have steps Ⅳ→Ⅲ→Ⅱ→Ⅰ', () => {
    for (const id of ['monster', 'super', 'hyper', 'master']) {
      expect(getStepsForTier(id)).toEqual(['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ']);
    }
  });

  it('champion has no step', () => {
    expect(getStepsForTier('champion')).toEqual([]);
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- ranks`
Expected: FAIL

- [ ] **Step 3: ranks 実装**

`lib/constants/ranks.ts`:
```ts
export type RankTierId = 'monster' | 'super' | 'hyper' | 'master' | 'champion';

export type RankTier = {
  id: RankTierId;
  label: string;
  steps: readonly string[];
};

export const RANKS: readonly RankTier[] = [
  { id: 'monster',   label: 'モンスターボール級', steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'super',     label: 'スーパーボール級',   steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'hyper',     label: 'ハイパーボール級',   steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'master',    label: 'マスターボール級',   steps: ['Ⅳ', 'Ⅲ', 'Ⅱ', 'Ⅰ'] },
  { id: 'champion',  label: 'チャンピオン級',     steps: [] },
] as const;

export function getStepsForTier(id: RankTierId): readonly string[] {
  return RANKS.find(r => r.id === id)?.steps ?? [];
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `npm test -- ranks`
Expected: 3 passed

- [ ] **Step 5: 残りの定数を実装（テストなし — 単なるデータ）**

`lib/constants/rules.ts`:
```ts
export const RULES = ['シングル', 'ダブル'] as const;
export type Rule = (typeof RULES)[number];
```

`lib/constants/battlegrounds.ts`:
```ts
export const BATTLEGROUNDS = [
  'ランクマッチ',
  'フレンド戦',
  '大会',
  'その他',
] as const;
export type Battleground = (typeof BATTLEGROUNDS)[number];
```

`lib/constants/presets.ts`:
```ts
export const PLAY_HISTORY_PRESETS = [
  'ポケチャンから',
  'ポケモン歴1年',
  'ポケモン歴5年',
  'ポケモン歴10年以上',
  '初代から',
] as const;

export const BATTLE_STYLE_PRESETS = [
  '対面',
  'サイクル',
  '展開',
  '推し活かす派',
] as const;
```

- [ ] **Step 6: 全テスト実行**

Run: `npm test`
Expected: 全てパス

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "feat: add rank/rule/battleground/preset constants"
```

---

### Task 6: 型定義と Zustand ストア（永続化込み）

**Files:**
- Create: `lib/types.ts`, `lib/store.ts`, `tests/lib/store.test.ts`

- [ ] **Step 1: 型定義**

`lib/types.ts`:
```ts
import type { RankTierId } from './constants/ranks';
import type { Rule } from './constants/rules';
import type { Battleground } from './constants/battlegrounds';

export type ResumeForm = {
  handle: string;
  iconDataUrl: string;
  oshiPokemon: string[];
  battleOshi: string[];
  comment: string;
  narabi: string[];
  playHistory: string;
  rules: Rule[];
  battleground: Battleground | null;
  battleStyle: string;
  rank: { tier: RankTierId; step: string | null } | null;
  snsLink: string;
  wantToConnect: string;
  oshiCreator: string;
};

export type ThemeId = 'official' | 'retro' | 'starry';

export type AppState = {
  form: ResumeForm;
  themeId: ThemeId;
  pokemonListMode: 'pokechan' | 'all';
  hasSeenInitialModal: boolean;
};

export const INITIAL_FORM: ResumeForm = {
  handle: '',
  iconDataUrl: '',
  oshiPokemon: [],
  battleOshi: [],
  comment: '',
  narabi: [],
  playHistory: '',
  rules: [],
  battleground: null,
  battleStyle: '',
  rank: null,
  snsLink: '',
  wantToConnect: '',
  oshiCreator: '',
};
```

- [ ] **Step 2: ストアの失敗テストを書く**

`tests/lib/store.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/lib/store';
import { INITIAL_FORM } from '@/lib/types';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      form: { ...INITIAL_FORM },
      themeId: 'official',
      pokemonListMode: 'pokechan',
      hasSeenInitialModal: false,
    });
  });

  it('updates a form field', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ' });
    expect(useAppStore.getState().form.handle).toBe('タロウ');
  });

  it('switches theme without losing form data', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ' });
    useAppStore.getState().setTheme('retro');
    expect(useAppStore.getState().themeId).toBe('retro');
    expect(useAppStore.getState().form.handle).toBe('タロウ');
  });

  it('resets form to initial values', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ', comment: 'こんにちは' });
    useAppStore.getState().resetForm();
    expect(useAppStore.getState().form).toEqual(INITIAL_FORM);
  });

  it('persists everything except iconDataUrl to localStorage', () => {
    useAppStore.getState().updateForm({ handle: 'タロウ', iconDataUrl: 'data:image/png;base64,XXX' });
    const raw = localStorage.getItem('pokechan-resume');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.form.handle).toBe('タロウ');
    expect(parsed.state.form.iconDataUrl).toBe('');
  });
});
```

- [ ] **Step 3: 失敗を確認**

Run: `npm test -- store`
Expected: FAIL（モジュール未定義）

- [ ] **Step 4: ストア実装**

`lib/store.ts`:
```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, ResumeForm, ThemeId } from './types';
import { INITIAL_FORM } from './types';

type Actions = {
  updateForm: (patch: Partial<ResumeForm>) => void;
  resetForm: () => void;
  setTheme: (themeId: ThemeId) => void;
  setPokemonListMode: (mode: 'pokechan' | 'all') => void;
  markInitialModalSeen: () => void;
};

export const useAppStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      form: { ...INITIAL_FORM },
      themeId: 'official',
      pokemonListMode: 'pokechan',
      hasSeenInitialModal: false,
      updateForm: (patch) => set((s) => ({ form: { ...s.form, ...patch } })),
      resetForm: () => set({ form: { ...INITIAL_FORM } }),
      setTheme: (themeId) => set({ themeId }),
      setPokemonListMode: (pokemonListMode) => set({ pokemonListMode }),
      markInitialModalSeen: () => set({ hasSeenInitialModal: true }),
    }),
    {
      name: 'pokechan-resume',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        form: { ...state.form, iconDataUrl: '' },
        themeId: state.themeId,
        pokemonListMode: state.pokemonListMode,
        hasSeenInitialModal: state.hasSeenInitialModal,
      }),
    },
  ),
);
```

- [ ] **Step 5: テストが通ることを確認**

Run: `npm test -- store`
Expected: 4 passed

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add ResumeForm types and Zustand store with persistence"
```

---

### Task 7: トップページのレイアウト骨格（PC 2カラム / モバイル sticky プレビュー）

**Files:**
- Modify: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
- Create: `components/Form/index.tsx`, `components/Preview/index.tsx`, `components/Footer.tsx`

- [ ] **Step 1: 空の `Form` と `Preview` プレースホルダ**

`components/Form/index.tsx`:
```tsx
'use client';
export function Form() {
  return <section aria-label="入力フォーム" className="space-y-4">フォーム（未実装）</section>;
}
```

`components/Preview/index.tsx`:
```tsx
'use client';
export function Preview() {
  return (
    <section aria-label="プレビュー" className="aspect-square w-full max-w-[540px] bg-neutral-100 border">
      プレビュー（未実装）
    </section>
  );
}
```

`components/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="border-t mt-12 py-6 text-xs text-neutral-500 text-center space-y-1">
      <p>アップロード画像の著作権はユーザー自身に帰属し、その責任もユーザーが負います。</p>
      <p>ポケモンチャンピオンズおよびポケモンは株式会社ポケモン／任天堂の登録商標です。本ツールは非公式です。</p>
    </footer>
  );
}
```

- [ ] **Step 2: トップページを2カラム/モバイルsticky構成に**

`app/page.tsx`:
```tsx
import { Form } from '@/components/Form';
import { Preview } from '@/components/Preview';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">ポケチャン履歴書メーカー</h1>
      </header>

      <div className="flex-1 md:grid md:grid-cols-2 md:gap-8 md:p-8">
        <div className="md:sticky md:top-8 md:self-start sticky top-0 z-10 bg-white p-4 md:p-0 border-b md:border-b-0">
          <Preview />
        </div>
        <div className="p-4 md:p-0">
          <Form />
        </div>
      </div>

      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: 動作確認**

Run: `npm run dev` → ブラウザで PC（広い幅）とモバイル幅（DevTools 375px）両方を確認:
- PC: 左にプレビュー、右にフォーム
- モバイル: 上にプレビューが sticky、下にフォーム

確認後 `Ctrl+C` で停止。

- [ ] **Step 4: ビルド確認**

Run: `npm run build`
Expected: ビルド成功

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "feat: add page skeleton with two-column desktop / sticky mobile preview"
```

---

### Task 8: ハンドル入力 / 一言コメント / つながりたい / 推し活動者（テキスト系フィールド）

**Files:**
- Create: `components/Form/HandleInput.tsx`, `components/Form/TextareaField.tsx`, `tests/components/HandleInput.test.tsx`, `tests/components/TextareaField.test.tsx`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: 失敗テスト（HandleInput）**

`tests/components/HandleInput.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HandleInput } from '@/components/Form/HandleInput';
import { useAppStore } from '@/lib/store';
import { INITIAL_FORM } from '@/lib/types';

describe('HandleInput', () => {
  beforeEach(() => {
    useAppStore.setState({ form: { ...INITIAL_FORM } });
  });

  it('writes typed value into store', async () => {
    render(<HandleInput />);
    await userEvent.type(screen.getByLabelText(/ハンドルネーム/), 'タロウ');
    expect(useAppStore.getState().form.handle).toBe('タロウ');
  });

  it('clamps input to 20 characters', async () => {
    render(<HandleInput />);
    await userEvent.type(screen.getByLabelText(/ハンドルネーム/), 'あ'.repeat(25));
    expect(useAppStore.getState().form.handle.length).toBe(20);
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- HandleInput`
Expected: FAIL

- [ ] **Step 3: HandleInput 実装**

`components/Form/HandleInput.tsx`:
```tsx
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';

const MAX = 20;

export function HandleInput() {
  const handle = useAppStore(s => s.form.handle);
  const updateForm = useAppStore(s => s.updateForm);
  return (
    <div className="space-y-1">
      <Label htmlFor="handle">ハンドルネーム <span className="text-red-500">*</span></Label>
      <Input
        id="handle"
        value={handle}
        maxLength={MAX}
        onChange={(e) => updateForm({ handle: e.target.value.slice(0, MAX) })}
      />
      <p className="text-xs text-neutral-500">{handle.length} / {MAX}</p>
    </div>
  );
}
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- HandleInput`
Expected: 2 passed

- [ ] **Step 5: TextareaField の失敗テスト**

`tests/components/TextareaField.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextareaField } from '@/components/Form/TextareaField';

describe('TextareaField', () => {
  it('calls onChange with input value', async () => {
    let value = '';
    render(
      <TextareaField
        id="t"
        label="テスト"
        value={value}
        onChange={(v) => { value = v; }}
        maxLength={10}
      />
    );
    await userEvent.type(screen.getByLabelText('テスト'), 'ハロー');
    expect(value).toBe('ハロー');
  });

  it('shows char counter respecting maxLength', () => {
    render(
      <TextareaField id="t" label="テスト" value="あいう" onChange={() => {}} maxLength={10} />
    );
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: 失敗を確認**

Run: `npm test -- TextareaField`
Expected: FAIL

- [ ] **Step 7: TextareaField 実装**

`components/Form/TextareaField.tsx`:
```tsx
'use client';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  required?: boolean;
  hint?: string;
  rows?: number;
};

export function TextareaField({ id, label, value, onChange, maxLength, required, hint, rows = 3 }: Props) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>
        {label}{required && <span className="text-red-500"> *</span>}
      </Label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      <Textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
      <p className="text-xs text-neutral-500">{value.length} / {maxLength}</p>
    </div>
  );
}
```

- [ ] **Step 8: テスト通過確認**

Run: `npm test -- TextareaField`
Expected: 2 passed

- [ ] **Step 9: Form に組み込む**

`components/Form/index.tsx`:
```tsx
'use client';
import { useAppStore } from '@/lib/store';
import { HandleInput } from './HandleInput';
import { TextareaField } from './TextareaField';

export function Form() {
  const form = useAppStore(s => s.form);
  const updateForm = useAppStore(s => s.updateForm);
  return (
    <section aria-label="入力フォーム" className="space-y-6">
      <HandleInput />
      <TextareaField
        id="comment"
        label="一言コメント / 自己紹介"
        required
        hint="30〜60文字推奨"
        value={form.comment}
        onChange={(v) => updateForm({ comment: v })}
        maxLength={80}
        rows={3}
      />
      <TextareaField
        id="wantToConnect"
        label="こんな人と繋がりたい！"
        value={form.wantToConnect}
        onChange={(v) => updateForm({ wantToConnect: v })}
        maxLength={60}
        rows={2}
      />
      <TextareaField
        id="oshiCreator"
        label="推しのポケモン活動者"
        value={form.oshiCreator}
        onChange={(v) => updateForm({ oshiCreator: v })}
        maxLength={50}
        rows={2}
      />
    </section>
  );
}
```

- [ ] **Step 10: ブラウザで手動確認**

Run: `npm run dev` → 入力 → リロード → 値が保持されていることを確認（iconDataUrl 除く）。

- [ ] **Step 11: コミット**

```bash
git add -A
git commit -m "feat: add handle and textarea fields with localStorage persistence"
```

---

### Task 9: アイコンアップロード（正方形クロップ）

**Files:**
- Create: `components/Form/AvatarUpload.tsx`, `lib/image-crop.ts`, `tests/lib/image-crop.test.ts`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: クロップ純関数の失敗テスト**

`tests/lib/image-crop.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { computeSquareCrop } from '@/lib/image-crop';

describe('computeSquareCrop', () => {
  it('returns full image when already square', () => {
    expect(computeSquareCrop(100, 100, 0.5, 0.5, 1)).toEqual({ x: 0, y: 0, size: 100 });
  });
  it('clamps crop within image bounds', () => {
    const r = computeSquareCrop(200, 100, 0.5, 0.5, 1);
    expect(r.size).toBe(100);
    expect(r.x).toBe(50);
    expect(r.y).toBe(0);
  });
  it('applies zoom by shrinking size', () => {
    const r = computeSquareCrop(200, 200, 0.5, 0.5, 2);
    expect(r.size).toBe(100);
    expect(r.x).toBe(50);
    expect(r.y).toBe(50);
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- image-crop`
Expected: FAIL

- [ ] **Step 3: 実装**

`lib/image-crop.ts`:
```ts
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
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- image-crop`
Expected: 3 passed

- [ ] **Step 5: AvatarUpload コンポーネント実装**

`components/Form/AvatarUpload.tsx`:
```tsx
'use client';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { fileToDataUrl, computeSquareCrop, cropDataUrl } from '@/lib/image-crop';

const MAX_BYTES = 5 * 1024 * 1024;

export function AvatarUpload() {
  const iconDataUrl = useAppStore(s => s.form.iconDataUrl);
  const updateForm = useAppStore(s => s.updateForm);

  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const onPick = useCallback(async (file: File) => {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError('5MB以下の画像をアップロードしてください');
      return;
    }
    if (!/^image\/(png|jpe?g)$/.test(file.type)) {
      setError('JPG または PNG のみアップロード可能です');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setEditing(dataUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const onConfirm = useCallback(async () => {
    if (!editing) return;
    let cropped: string;
    if (areaPx) {
      const img = new Image();
      img.src = editing;
      await new Promise<void>((r) => { img.onload = () => r(); });
      cropped = await cropDataUrl(editing, { x: areaPx.x, y: areaPx.y, size: areaPx.width });
    } else {
      const img = new Image();
      img.src = editing;
      await new Promise<void>((r) => { img.onload = () => r(); });
      const c = computeSquareCrop(img.naturalWidth, img.naturalHeight, 0.5, 0.5, 1);
      cropped = await cropDataUrl(editing, c);
    }
    updateForm({ iconDataUrl: cropped });
    setEditing(null);
  }, [editing, areaPx, updateForm]);

  return (
    <div className="space-y-2">
      <Label>アイコン画像 <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-3">
        {iconDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconDataUrl} alt="" className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-neutral-200 border" />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>正方形にトリミング</DialogTitle></DialogHeader>
          <div className="relative w-full h-64 bg-black">
            {editing && (
              <Cropper
                image={editing}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setAreaPx(area)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>キャンセル</Button>
            <Button onClick={onConfirm}>確定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 6: Form に組み込み**

`components/Form/index.tsx` の `HandleInput` の直後に追加:
```tsx
import { AvatarUpload } from './AvatarUpload';
// ...
<HandleInput />
<AvatarUpload />
```

- [ ] **Step 7: 手動確認**

Run: `npm run dev` → 5MB超の画像 / 不正な形式 でエラー、JPG/PNG で正常クロップ確定 → プレビュー欄に表示されることを確認。

- [ ] **Step 8: コミット**

```bash
git add -A
git commit -m "feat: add avatar upload with square crop"
```

---

### Task 10: PokemonPicker コンポーネント（211/1050切替・検索・選択チップ）

**Files:**
- Create: `lib/constants/pokemon.ts`, `components/Form/PokemonPicker.tsx`, `tests/lib/constants/pokemon.test.ts`, `tests/components/PokemonPicker.test.tsx`

- [ ] **Step 1: pokemon ローダの失敗テスト**

`tests/lib/constants/pokemon.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { POKEMON_POKECHAN, POKEMON_ALL, searchPokemon } from '@/lib/constants/pokemon';

describe('pokemon data', () => {
  it('exposes 211 pokechan entries', () => {
    expect(POKEMON_POKECHAN.length).toBe(211);
  });
  it('exposes 1050 all entries', () => {
    expect(POKEMON_ALL.length).toBe(1050);
  });
});

describe('searchPokemon', () => {
  it('returns full list when query is empty', () => {
    expect(searchPokemon(POKEMON_POKECHAN, '').length).toBe(211);
  });
  it('does prefix-friendly substring match (case insensitive)', () => {
    const r = searchPokemon(POKEMON_POKECHAN, 'ライチュウ');
    expect(r).toContain('ライチュウ');
    expect(r).toContain('ライチュウ（アローラ）');
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- constants/pokemon`
Expected: FAIL

- [ ] **Step 3: pokemon ローダ実装**

`lib/constants/pokemon.ts`:
```ts
import pokechan from '@/data/pokemon-pokechan.json';
import all from '@/data/pokemon-all.json';

export const POKEMON_POKECHAN: readonly string[] = pokechan;
export const POKEMON_ALL: readonly string[] = all;

export function searchPokemon(list: readonly string[], query: string): readonly string[] {
  const q = query.trim();
  if (!q) return list;
  return list.filter((name) => name.includes(q));
}
```

`tsconfig.json` の `compilerOptions` に `"resolveJsonModule": true` が有効か確認（Next.js デフォルトで有効のはず。なければ追加）。

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- constants/pokemon`
Expected: 4 passed

- [ ] **Step 5: PokemonPicker の失敗テスト**

`tests/components/PokemonPicker.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PokemonPicker } from '@/components/Form/PokemonPicker';

describe('PokemonPicker', () => {
  it('filters list by katakana incremental search', async () => {
    render(<PokemonPicker label="推し" value={[]} onChange={() => {}} max={3} />);
    await userEvent.type(screen.getByLabelText('ポケモン検索'), 'リザード');
    expect(screen.getByRole('button', { name: 'リザードン' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'フシギバナ' })).not.toBeInTheDocument();
  });

  it('adds selected pokemon as chip, prevents duplicates, respects max', async () => {
    let v: string[] = [];
    const { rerender } = render(
      <PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'フシギバナ' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />);
    expect(v).toEqual(['フシギバナ']);

    await userEvent.click(screen.getByRole('button', { name: 'フシギバナ' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />);
    expect(v).toEqual(['フシギバナ']);

    await userEvent.click(screen.getByRole('button', { name: 'リザードン' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={2} />);
    expect(v).toEqual(['フシギバナ', 'リザードン']);

    await userEvent.click(screen.getByRole('button', { name: 'カメックス' }));
    expect(v.length).toBe(2);
  });

  it('removes pokemon when chip × is clicked', async () => {
    let v = ['フシギバナ'];
    const { rerender } = render(
      <PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={3} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'フシギバナ を削除' }));
    rerender(<PokemonPicker label="推し" value={v} onChange={(n) => { v = n; }} max={3} />);
    expect(v).toEqual([]);
  });
});
```

- [ ] **Step 6: 失敗を確認**

Run: `npm test -- PokemonPicker`
Expected: FAIL

- [ ] **Step 7: PokemonPicker 実装**

`components/Form/PokemonPicker.tsx`:
```tsx
'use client';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { POKEMON_ALL, POKEMON_POKECHAN, searchPokemon } from '@/lib/constants/pokemon';

type Props = {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  min?: number;
  max: number;
  hint?: string;
};

export function PokemonPicker({ label, value, onChange, min = 1, max, hint }: Props) {
  const mode = useAppStore(s => s.pokemonListMode);
  const setMode = useAppStore(s => s.setPokemonListMode);
  const [query, setQuery] = useState('');

  const source = mode === 'pokechan' ? POKEMON_POKECHAN : POKEMON_ALL;
  const results = useMemo(() => searchPokemon(source, query).slice(0, 80), [source, query]);

  const add = (name: string) => {
    if (value.includes(name)) return;
    if (value.length >= max) return;
    onChange([...value, name]);
  };
  const remove = (name: string) => onChange(value.filter(n => n !== name));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      <p className="text-xs text-neutral-500">{min === max ? `${max}匹` : `${min}〜${max}匹`}選択</p>

      <div className="flex flex-wrap gap-1">
        {value.map((name) => (
          <span key={name} className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded text-sm">
            {name}
            <button
              type="button"
              aria-label={`${name} を削除`}
              onClick={() => remove(name)}
              className="text-neutral-500 hover:text-neutral-900"
            >×</button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === 'pokechan'}
            onChange={() => setMode('pokechan')}
          />
          ポケチャン内定（211）
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === 'all'}
            onChange={() => setMode('all')}
          />
          全ポケモン（1050）
        </label>
      </div>

      <Input
        aria-label="ポケモン検索"
        placeholder="カタカナで検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="max-h-40 overflow-y-auto border rounded">
        {results.map((name) => {
          const selected = value.includes(name);
          const disabled = !selected && value.length >= max;
          return (
            <button
              key={name}
              type="button"
              disabled={disabled}
              onClick={() => add(name)}
              className={`block w-full text-left px-3 py-1 text-sm hover:bg-neutral-100 ${selected ? 'bg-neutral-200' : ''} disabled:opacity-40`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: テスト通過確認**

Run: `npm test -- PokemonPicker`
Expected: 3 passed

- [ ] **Step 9: コミット**

```bash
git add -A
git commit -m "feat: add PokemonPicker with search/mode/chip selection"
```

---

### Task 11: 推し / バトル推し / 並び — Form に PokemonPicker を3箇所配線

**Files:**
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: 既存 Form の HandleInput と一言コメントの間に3フィールドを追加**

`components/Form/index.tsx` を編集（HandleInput 直後、AvatarUpload の後あたり）:
```tsx
import { PokemonPicker } from './PokemonPicker';
// ...
<PokemonPicker
  label="推し（純粋推しポケモン） *"
  value={form.oshiPokemon}
  onChange={(v) => updateForm({ oshiPokemon: v })}
  min={1}
  max={3}
/>
<PokemonPicker
  label="バトルでの推し *"
  value={form.battleOshi}
  onChange={(v) => updateForm({ battleOshi: v })}
  min={1}
  max={3}
/>
<PokemonPicker
  label="推しの並び（任意）"
  hint="対戦上相性の良いポケモンの組み合わせ（パーティの核）"
  value={form.narabi}
  onChange={(v) => updateForm({ narabi: v })}
  min={2}
  max={3}
/>
```

- [ ] **Step 2: 動作確認**

Run: `npm run dev` → 3つの Picker がそれぞれ独立して選択可能、ストアに保存され、リロード後も復元（モード切替も保持）。

- [ ] **Step 3: コミット**

```bash
git add -A
git commit -m "feat: wire PokemonPicker to oshi/battle-oshi/narabi fields"
```

---

### Task 12: RankPicker（級 + 段階の階層選択）

**Files:**
- Create: `components/Form/RankPicker.tsx`, `tests/components/RankPicker.test.tsx`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: 失敗テスト**

`tests/components/RankPicker.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RankPicker } from '@/components/Form/RankPicker';

describe('RankPicker', () => {
  it('shows step selector for non-champion tier', async () => {
    let v: any = null;
    render(<RankPicker value={v} onChange={(x) => { v = x; }} />);
    await userEvent.selectOptions(screen.getByLabelText('級'), 'hyper');
    expect(screen.getByLabelText('段階')).toBeInTheDocument();
  });

  it('hides step selector for champion tier and sets step to null', async () => {
    let v: any = null;
    const { rerender } = render(<RankPicker value={v} onChange={(x) => { v = x; }} />);
    await userEvent.selectOptions(screen.getByLabelText('級'), 'champion');
    rerender(<RankPicker value={v} onChange={(x) => { v = x; }} />);
    expect(v).toEqual({ tier: 'champion', step: null });
    expect(screen.queryByLabelText('段階')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- RankPicker`
Expected: FAIL

- [ ] **Step 3: 実装**

`components/Form/RankPicker.tsx`:
```tsx
'use client';
import { Label } from '@/components/ui/label';
import { RANKS, getStepsForTier, type RankTierId } from '@/lib/constants/ranks';

type Value = { tier: RankTierId; step: string | null } | null;

export function RankPicker({ value, onChange }: { value: Value; onChange: (v: Value) => void }) {
  const steps = value ? getStepsForTier(value.tier) : [];
  return (
    <div className="space-y-2">
      <Label htmlFor="rank-tier">現在ランク</Label>
      <div className="flex gap-2">
        <select
          id="rank-tier"
          aria-label="級"
          className="border rounded px-2 py-1"
          value={value?.tier ?? ''}
          onChange={(e) => {
            const tier = e.target.value as RankTierId | '';
            if (!tier) return onChange(null);
            const nextSteps = getStepsForTier(tier);
            onChange({ tier, step: nextSteps.length ? nextSteps[0] : null });
          }}
        >
          <option value="">未選択</option>
          {RANKS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>

        {value && steps.length > 0 && (
          <select
            aria-label="段階"
            className="border rounded px-2 py-1"
            value={value.step ?? ''}
            onChange={(e) => onChange({ tier: value.tier, step: e.target.value || null })}
          >
            {steps.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- RankPicker`
Expected: 2 passed

- [ ] **Step 5: Form に組み込み**

`components/Form/index.tsx` で:
```tsx
import { RankPicker } from './RankPicker';
// ...
<RankPicker value={form.rank} onChange={(v) => updateForm({ rank: v })} />
```

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add RankPicker with tier and step selectors"
```

---

### Task 13: RuleCheckboxes と BattlegroundSelect

**Files:**
- Create: `components/Form/RuleCheckboxes.tsx`, `components/Form/BattlegroundSelect.tsx`, `tests/components/RuleCheckboxes.test.tsx`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: RuleCheckboxes 失敗テスト**

`tests/components/RuleCheckboxes.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RuleCheckboxes } from '@/components/Form/RuleCheckboxes';

describe('RuleCheckboxes', () => {
  it('toggles values', async () => {
    let v: ('シングル' | 'ダブル')[] = [];
    const { rerender } = render(<RuleCheckboxes value={v} onChange={(x) => { v = x; }} />);
    await userEvent.click(screen.getByLabelText('シングル'));
    rerender(<RuleCheckboxes value={v} onChange={(x) => { v = x; }} />);
    expect(v).toEqual(['シングル']);
    await userEvent.click(screen.getByLabelText('ダブル'));
    rerender(<RuleCheckboxes value={v} onChange={(x) => { v = x; }} />);
    expect(v).toEqual(['シングル', 'ダブル']);
    await userEvent.click(screen.getByLabelText('シングル'));
    expect(v).toEqual(['ダブル']);
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- RuleCheckboxes`
Expected: FAIL

- [ ] **Step 3: 実装**

`components/Form/RuleCheckboxes.tsx`:
```tsx
'use client';
import { Label } from '@/components/ui/label';
import { RULES, type Rule } from '@/lib/constants/rules';

export function RuleCheckboxes({ value, onChange }: { value: Rule[]; onChange: (v: Rule[]) => void }) {
  const toggle = (r: Rule) =>
    onChange(value.includes(r) ? value.filter(x => x !== r) : [...value, r]);
  return (
    <div className="space-y-1">
      <Label>好きなルール</Label>
      <div className="flex gap-4">
        {RULES.map(r => (
          <label key={r} className="flex items-center gap-1">
            <input type="checkbox" checked={value.includes(r)} onChange={() => toggle(r)} />
            <span>{r}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
```

`components/Form/BattlegroundSelect.tsx`:
```tsx
'use client';
import { Label } from '@/components/ui/label';
import { BATTLEGROUNDS, type Battleground } from '@/lib/constants/battlegrounds';

export function BattlegroundSelect({
  value,
  onChange,
}: {
  value: Battleground | null;
  onChange: (v: Battleground | null) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor="bg">主戦場</Label>
      <select
        id="bg"
        className="border rounded px-2 py-1"
        value={value ?? ''}
        onChange={(e) => onChange((e.target.value || null) as Battleground | null)}
      >
        <option value="">未選択</option>
        {BATTLEGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
  );
}
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- RuleCheckboxes`
Expected: 1 passed

- [ ] **Step 5: Form に組み込み**

```tsx
import { RuleCheckboxes } from './RuleCheckboxes';
import { BattlegroundSelect } from './BattlegroundSelect';
// ...
<RuleCheckboxes value={form.rules} onChange={(v) => updateForm({ rules: v })} />
<BattlegroundSelect value={form.battleground} onChange={(v) => updateForm({ battleground: v })} />
```

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add rule checkboxes and battleground select"
```

---

### Task 14: PresetChipInput（プレイ歴 / バトルスタイル共通）

**Files:**
- Create: `components/Form/PresetChipInput.tsx`, `tests/components/PresetChipInput.test.tsx`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: 失敗テスト**

`tests/components/PresetChipInput.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PresetChipInput } from '@/components/Form/PresetChipInput';

describe('PresetChipInput', () => {
  it('fills the text input when a preset chip is clicked', async () => {
    let v = '';
    const { rerender } = render(
      <PresetChipInput
        id="ph"
        label="プレイ歴"
        presets={['A', 'B']}
        value={v}
        onChange={(x) => { v = x; }}
        maxLength={20}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    rerender(<PresetChipInput id="ph" label="プレイ歴" presets={['A','B']} value={v} onChange={(x) => { v = x; }} maxLength={20} />);
    expect(v).toBe('A');
  });

  it('allows free typing that overrides preset', async () => {
    let v = '';
    render(
      <PresetChipInput
        id="ph"
        label="プレイ歴"
        presets={['A', 'B']}
        value={v}
        onChange={(x) => { v = x; }}
        maxLength={20}
      />
    );
    await userEvent.type(screen.getByLabelText('プレイ歴'), 'カスタム');
    expect(v).toBe('カスタム');
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- PresetChipInput`
Expected: FAIL

- [ ] **Step 3: 実装**

`components/Form/PresetChipInput.tsx`:
```tsx
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  id: string;
  label: string;
  presets: readonly string[];
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
};

export function PresetChipInput({ id, label, presets, value, onChange, maxLength }: Props) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap gap-1">
        {presets.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="text-xs px-2 py-1 border rounded hover:bg-neutral-100"
          >
            {p}
          </button>
        ))}
      </div>
      <Input
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
    </div>
  );
}
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- PresetChipInput`
Expected: 2 passed

- [ ] **Step 5: Form に組み込み**

```tsx
import { PresetChipInput } from './PresetChipInput';
import { PLAY_HISTORY_PRESETS, BATTLE_STYLE_PRESETS } from '@/lib/constants/presets';
// ...
<PresetChipInput
  id="playHistory"
  label="プレイ歴"
  presets={PLAY_HISTORY_PRESETS}
  value={form.playHistory}
  onChange={(v) => updateForm({ playHistory: v })}
  maxLength={30}
/>
<PresetChipInput
  id="battleStyle"
  label="好きなバトルスタイル"
  presets={BATTLE_STYLE_PRESETS}
  value={form.battleStyle}
  onChange={(v) => updateForm({ battleStyle: v })}
  maxLength={20}
/>
```

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add preset chip input for play history and battle style"
```

---

### Task 15: SNS リンク入力（URL バリデーション付き）

**Files:**
- Create: `components/Form/UrlInput.tsx`, `tests/components/UrlInput.test.tsx`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: 失敗テスト**

`tests/components/UrlInput.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UrlInput } from '@/components/Form/UrlInput';

describe('UrlInput', () => {
  it('shows error for invalid URL', async () => {
    render(<UrlInput value="" onChange={() => {}} />);
    const input = screen.getByLabelText(/配信/);
    await userEvent.type(input, 'not-a-url');
    expect(screen.getByText('http:// または https:// で始まる URL を入力してください')).toBeInTheDocument();
  });

  it('accepts valid URL', async () => {
    let v = '';
    const { rerender } = render(<UrlInput value={v} onChange={(x) => { v = x; }} />);
    await userEvent.type(screen.getByLabelText(/配信/), 'https://example.com');
    rerender(<UrlInput value={v} onChange={(x) => { v = x; }} />);
    expect(screen.queryByText(/URL を入力/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- UrlInput`
Expected: FAIL

- [ ] **Step 3: 実装**

`components/Form/UrlInput.tsx`:
```tsx
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function isValidHttpUrl(v: string): boolean {
  if (!v) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function UrlInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const invalid = !isValidHttpUrl(value);
  return (
    <div className="space-y-1">
      <Label htmlFor="snsLink">配信 / 他SNSリンク</Label>
      <Input
        id="snsLink"
        type="url"
        placeholder="https://..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {invalid && (
        <p className="text-xs text-red-500">http:// または https:// で始まる URL を入力してください</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- UrlInput`
Expected: 2 passed

- [ ] **Step 5: Form に組み込み**

```tsx
import { UrlInput } from './UrlInput';
// ...
<UrlInput value={form.snsLink} onChange={(v) => updateForm({ snsLink: v })} />
```

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add SNS URL input with validation"
```

---

### Task 16: プレビュー枠（テーマ切替） & Credit

**Files:**
- Create: `components/Preview/Credit.tsx`, `components/Preview/themes/Official.tsx`, `components/Preview/themes/Retro.tsx`, `components/Preview/themes/Starry.tsx`, `lib/constants/site.ts`
- Modify: `components/Preview/index.tsx`

- [ ] **Step 1: サイト URL 定数**

`lib/constants/site.ts`:
```ts
export const SITE_URL = 'pokechan-resume.vercel.app';
export const SITE_NAME = 'ポケチャン履歴書メーカー';
export const HASHTAG = '#ポケチャン履歴書';
```

- [ ] **Step 2: Credit コンポーネント**

`components/Preview/Credit.tsx`:
```tsx
import { SITE_URL } from '@/lib/constants/site';

export function Credit({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute bottom-3 right-4 text-[10px] opacity-70 ${className}`}>
      {SITE_URL}
    </div>
  );
}
```

- [ ] **Step 3: 3テーマのスタブ（空 div だけ。中身は次タスクで埋める）**

`components/Preview/themes/Official.tsx`:
```tsx
import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
export function Official({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-white">
      <Credit />
      <div className="p-8">official: {form.handle}</div>
    </div>
  );
}
```

`components/Preview/themes/Retro.tsx`:
```tsx
import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
export function Retro({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-[#9bbc0f] text-[#0f380f]">
      <Credit />
      <div className="p-8">retro: {form.handle}</div>
    </div>
  );
}
```

`components/Preview/themes/Starry.tsx`:
```tsx
import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
export function Starry({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-[#1a1a3a] text-white">
      <Credit className="text-white/60" />
      <div className="p-8">starry: {form.handle}</div>
    </div>
  );
}
```

- [ ] **Step 4: プレビュー枠を 1080×1080 固定で描画してスケール表示**

`components/Preview/index.tsx`:
```tsx
'use client';
import { forwardRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Official } from './themes/Official';
import { Retro } from './themes/Retro';
import { Starry } from './themes/Starry';

export const PREVIEW_PX = 1080;
export const PREVIEW_EXPORT_SCALE = 2;

export const PreviewCanvas = forwardRef<HTMLDivElement>(function PreviewCanvas(_, ref) {
  const form = useAppStore(s => s.form);
  const themeId = useAppStore(s => s.themeId);
  return (
    <div
      ref={ref}
      style={{ width: PREVIEW_PX, height: PREVIEW_PX }}
      className="relative overflow-hidden"
    >
      {themeId === 'official' && <Official form={form} />}
      {themeId === 'retro' && <Retro form={form} />}
      {themeId === 'starry' && <Starry form={form} />}
    </div>
  );
});

export function Preview() {
  return (
    <section aria-label="プレビュー" className="w-full max-w-[540px] mx-auto">
      <div
        className="relative w-full overflow-hidden border rounded"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ transform: 'scale(var(--preview-scale, 0.5))' }}
        >
          <PreviewCanvas />
        </div>
      </div>
    </section>
  );
}
```

`app/globals.css` に追加（プレビューを 540px 幅にフィットさせる固定スケール）:
```css
:root { --preview-scale: 0.5; }
```

注: 表示幅が 540px のとき 0.5 倍で 540px 表示。html-to-image に渡すのはスケール前の `PreviewCanvas` ref（1080px ネイティブ）。

- [ ] **Step 5: 手動確認**

Run: `npm run dev`
Expected: テーマごとに背景色が変わったプレースホルダがプレビュー枠に表示される（テーマ切替UIはまだない）。

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "feat: add preview canvas with theme stubs and credit"
```

---

### Task 17: Official テーマ（ゲーム公式風）

**Files:**
- Modify: `components/Preview/themes/Official.tsx`

- [ ] **Step 1: Official テーマを設計に沿って実装**

`components/Preview/themes/Official.tsx`:
```tsx
import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';
import { SITE_NAME } from '@/lib/constants/site';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Official({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-600 text-white font-sans">
      <div className="h-[88px] bg-red-700 flex items-center px-10">
        <div className="text-2xl font-bold tracking-wider">TRAINER CARD</div>
        <div className="ml-auto text-sm opacity-80">{SITE_NAME}</div>
      </div>

      <div className="bg-white text-neutral-900 m-8 rounded-2xl shadow-xl p-8 h-[calc(100%-152px)] flex flex-col gap-6">
        <div className="flex items-center gap-6">
          {form.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.iconDataUrl} alt="" className="w-36 h-36 rounded-full object-cover border-4 border-red-500" />
          ) : (
            <div className="w-36 h-36 rounded-full bg-neutral-200 border-4 border-red-500" />
          )}
          <div className="flex-1">
            <div className="text-3xl font-bold">{form.handle || 'TRAINER'}</div>
            <div className="text-base text-neutral-600 mt-1">{rankLabel(form.rank)}</div>
            <div className="mt-3 text-base">{form.comment}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
          {form.oshiPokemon.length > 0 && <Field label="推し" values={form.oshiPokemon} />}
          {form.battleOshi.length > 0 && <Field label="バトル推し" values={form.battleOshi} />}
          {form.narabi.length > 0 && <Field label="並び" values={form.narabi} />}
          {form.rules.length > 0 && <Field label="好きなルール" values={form.rules} />}
          {form.battleground && <Field label="主戦場" values={[form.battleground]} />}
          {form.battleStyle && <Field label="バトルスタイル" values={[form.battleStyle]} />}
          {form.playHistory && <Field label="プレイ歴" values={[form.playHistory]} />}
          {form.oshiCreator && <Field label="推し活動者" values={[form.oshiCreator]} />}
        </div>

        {form.wantToConnect && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3">
            <div className="text-xs text-red-700 font-bold">こんな人と繋がりたい！</div>
            <div className="text-base">{form.wantToConnect}</div>
          </div>
        )}

        {form.snsLink && (
          <div className="text-sm text-blue-600 break-all">{form.snsLink}</div>
        )}
      </div>

      <Credit />
    </div>
  );
}

function Field({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <div className="text-xs text-red-700 font-bold">{label}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {values.map(v => (
          <span key={v} className="bg-red-100 text-red-900 px-2 py-0.5 rounded text-sm">{v}</span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 手動確認**

Run: `npm run dev` → 各フィールドを入力 → プレビューに反映されることを確認。

- [ ] **Step 3: コミット**

```bash
git add -A
git commit -m "feat: implement official (trainer card) theme"
```

---

### Task 18: Retro テーマ（GB初代風）

**Files:**
- Modify: `components/Preview/themes/Retro.tsx`, `app/globals.css`

- [ ] **Step 1: モノスペース系フォントを Tailwind で利用可能にする**

`app/globals.css` に追加:
```css
.font-pixel {
  font-family: ui-monospace, 'Cascadia Mono', Menlo, monospace;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 2: Retro 実装**

`components/Preview/themes/Retro.tsx`:
```tsx
import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Retro({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-[#9bbc0f] text-[#0f380f] font-pixel p-12">
      <div className="border-4 border-[#0f380f] h-full p-8 relative">
        <div className="text-3xl font-bold mb-6">▶ TRAINER DATA</div>

        <div className="flex items-start gap-6 mb-6">
          {form.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.iconDataUrl} alt="" className="w-32 h-32 object-cover border-4 border-[#0f380f] [image-rendering:pixelated]" />
          ) : (
            <div className="w-32 h-32 bg-[#306230] border-4 border-[#0f380f]" />
          )}
          <div>
            <div className="text-4xl">{form.handle || 'NONAME'}</div>
            <div className="text-lg mt-2">{rankLabel(form.rank)}</div>
          </div>
        </div>

        <div className="space-y-2 text-lg">
          {form.comment && <Line label="MSG" value={form.comment} />}
          {form.oshiPokemon.length > 0 && <Line label="OSHI" value={form.oshiPokemon.join(' / ')} />}
          {form.battleOshi.length > 0 && <Line label="BTL" value={form.battleOshi.join(' / ')} />}
          {form.narabi.length > 0 && <Line label="LINK" value={form.narabi.join(' / ')} />}
          {form.rules.length > 0 && <Line label="RULE" value={form.rules.join(' & ')} />}
          {form.battleground && <Line label="AREA" value={form.battleground} />}
          {form.battleStyle && <Line label="STYL" value={form.battleStyle} />}
          {form.playHistory && <Line label="HIST" value={form.playHistory} />}
          {form.wantToConnect && <Line label="WANT" value={form.wantToConnect} />}
          {form.oshiCreator && <Line label="FAV " value={form.oshiCreator} />}
          {form.snsLink && <Line label="LINK" value={form.snsLink} />}
        </div>

        <Credit className="text-[#0f380f]" />
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="opacity-70">[{label}]</span>
      <span className="flex-1 break-all">{value}</span>
    </div>
  );
}
```

- [ ] **Step 3: 手動確認**

Run: `npm run dev` → テーマ切替UIは未だないので、Zustand devtools か `useAppStore.setState({ themeId: 'retro' })` を一時的に書いて切替し、表示確認。確認後元に戻す。

- [ ] **Step 4: コミット**

```bash
git add -A
git commit -m "feat: implement retro (GB) theme"
```

---

### Task 19: Starry テーマ（星空・月夜）

**Files:**
- Modify: `components/Preview/themes/Starry.tsx`

- [ ] **Step 1: Starry 実装**

`components/Preview/themes/Starry.tsx`:
```tsx
import type { ResumeForm } from '@/lib/types';
import { Credit } from '../Credit';
import { RANKS } from '@/lib/constants/ranks';

function rankLabel(rank: ResumeForm['rank']): string {
  if (!rank) return '';
  const tier = RANKS.find(r => r.id === rank.tier);
  if (!tier) return '';
  return rank.step ? `${tier.label} ${rank.step}` : tier.label;
}

export function Starry({ form }: { form: ResumeForm }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1145] via-[#2a1a5e] to-[#3a1f6e] text-white overflow-hidden">
      <Stars />
      <Moon />

      <div className="relative p-16 h-full flex flex-col gap-8">
        <div className="flex items-center gap-8">
          {form.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.iconDataUrl}
              alt=""
              className="w-40 h-40 rounded-full object-cover ring-4 ring-amber-200/60 shadow-[0_0_40px_rgba(252,211,77,0.4)]"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-white/10 ring-4 ring-amber-200/60" />
          )}
          <div>
            <div className="text-5xl font-serif tracking-wide">{form.handle || 'Trainer'}</div>
            <div className="text-amber-200/80 mt-2 text-lg">{rankLabel(form.rank)}</div>
          </div>
        </div>

        {form.comment && (
          <div className="text-xl italic text-amber-50/90 border-l-2 border-amber-200/60 pl-4">
            {form.comment}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 text-base">
          {form.oshiPokemon.length > 0 && <StarryField label="推し" values={form.oshiPokemon} />}
          {form.battleOshi.length > 0 && <StarryField label="バトル推し" values={form.battleOshi} />}
          {form.narabi.length > 0 && <StarryField label="並び" values={form.narabi} />}
          {form.rules.length > 0 && <StarryField label="ルール" values={form.rules} />}
          {form.battleground && <StarryField label="主戦場" values={[form.battleground]} />}
          {form.battleStyle && <StarryField label="バトルスタイル" values={[form.battleStyle]} />}
          {form.playHistory && <StarryField label="プレイ歴" values={[form.playHistory]} />}
          {form.oshiCreator && <StarryField label="推し活動者" values={[form.oshiCreator]} />}
        </div>

        {form.wantToConnect && (
          <div className="text-base text-amber-50/90">
            <div className="text-amber-200/80 text-sm mb-1">こんな人と繋がりたい</div>
            {form.wantToConnect}
          </div>
        )}

        {form.snsLink && (
          <div className="text-sm text-amber-200/80 break-all">{form.snsLink}</div>
        )}
      </div>

      <Credit className="text-white/60" />
    </div>
  );
}

function StarryField({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <div className="text-amber-200/80 text-sm">{label}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {values.map(v => (
          <span key={v} className="bg-white/10 backdrop-blur px-2 py-0.5 rounded text-amber-50">{v}</span>
        ))}
      </div>
    </div>
  );
}

function Stars() {
  const dots = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map(i => {
        const top = (i * 53) % 100;
        const left = (i * 89) % 100;
        const size = (i % 3) + 1;
        return (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
          />
        );
      })}
    </div>
  );
}

function Moon() {
  return (
    <div className="absolute top-16 right-20 w-32 h-32 rounded-full bg-amber-100 shadow-[0_0_80px_rgba(254,243,199,0.6)]" />
  );
}
```

- [ ] **Step 2: 手動確認**

Run: `npm run dev` → 一時切替で starry が表示されることを確認。

- [ ] **Step 3: コミット**

```bash
git add -A
git commit -m "feat: implement starry (night sky) theme"
```

---

### Task 20: テーマセレクタ + 初回テーマ選択モーダル

**Files:**
- Create: `components/Form/ThemeSelector.tsx`, `components/InitialThemeModal.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: ThemeSelector（ヘッダ用）**

`components/Form/ThemeSelector.tsx`:
```tsx
'use client';
import { useAppStore } from '@/lib/store';
import type { ThemeId } from '@/lib/types';

const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'official', label: 'ゲーム公式風' },
  { id: 'retro',    label: 'レトロドット' },
  { id: 'starry',   label: '星空・月夜' },
];

export function ThemeSelector() {
  const themeId = useAppStore(s => s.themeId);
  const setTheme = useAppStore(s => s.setTheme);
  return (
    <select
      aria-label="テーマ切替"
      className="border rounded px-2 py-1 text-sm"
      value={themeId}
      onChange={(e) => setTheme(e.target.value as ThemeId)}
    >
      {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
    </select>
  );
}
```

- [ ] **Step 2: 初回モーダル**

`components/InitialThemeModal.tsx`:
```tsx
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { ThemeId } from '@/lib/types';

const THEMES: { id: ThemeId; label: string; desc: string }[] = [
  { id: 'official', label: 'ゲーム公式風', desc: 'トレーナーカード調・赤バー' },
  { id: 'retro',    label: 'レトロドット', desc: 'GB初代の液晶緑' },
  { id: 'starry',   label: '星空・月夜',   desc: '紺＋月のエレガント' },
];

export function InitialThemeModal() {
  const seen = useAppStore(s => s.hasSeenInitialModal);
  const mark = useAppStore(s => s.markInitialModalSeen);
  const setTheme = useAppStore(s => s.setTheme);

  return (
    <Dialog open={!seen} onOpenChange={(o) => { if (!o) mark(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>デザインテーマを選んでください</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTheme(t.id); mark(); }}
              className="text-left border rounded p-3 hover:bg-neutral-50"
            >
              <div className="font-bold">{t.label}</div>
              <div className="text-xs text-neutral-500">{t.desc}</div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => mark()}>あとで決める</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: ヘッダにセレクタ、ページ内にモーダルを配置**

`app/page.tsx`:
```tsx
import { Form } from '@/components/Form';
import { Preview } from '@/components/Preview';
import { Footer } from '@/components/Footer';
import { ThemeSelector } from '@/components/Form/ThemeSelector';
import { InitialThemeModal } from '@/components/InitialThemeModal';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">ポケチャン履歴書メーカー</h1>
        <ThemeSelector />
      </header>
      <div className="flex-1 md:grid md:grid-cols-2 md:gap-8 md:p-8">
        <div className="md:sticky md:top-8 md:self-start sticky top-0 z-10 bg-white p-4 md:p-0 border-b md:border-b-0">
          <Preview />
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
```

- [ ] **Step 4: 手動確認**

Run: `npm run dev` → localStorage 初期状態でアクセス → モーダル表示・テーマ選択で閉じる。ヘッダのセレクタで随時切替できる。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "feat: add theme selector and initial theme modal"
```

---

### Task 21: 画像エクスポート（html-to-image ラッパ）と ファイル名生成

**Files:**
- Create: `lib/filename.ts`, `lib/image-export.ts`, `tests/lib/filename.test.ts`, `tests/lib/image-export.test.ts`

- [ ] **Step 1: filename 失敗テスト**

`tests/lib/filename.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildFilename } from '@/lib/filename';

describe('buildFilename', () => {
  it('formats with handle and ISO-ish stamp', () => {
    const d = new Date('2026-05-14T15:23:09+09:00');
    expect(buildFilename('タロウ', d)).toBe('pokechan-resume-タロウ-20260514-152309.png');
  });
  it('uses anonymous when handle is empty', () => {
    expect(buildFilename('', new Date('2026-05-14T15:23:09+09:00')))
      .toBe('pokechan-resume-anonymous-20260514-152309.png');
  });
  it('strips characters unsafe for filenames', () => {
    expect(buildFilename('a/b\\c?', new Date('2026-05-14T15:23:09+09:00')))
      .toBe('pokechan-resume-abc-20260514-152309.png');
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- filename`
Expected: FAIL

- [ ] **Step 3: 実装**

`lib/filename.ts`:
```ts
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
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- filename`
Expected: 3 passed

- [ ] **Step 5: image-export 失敗テスト**

`tests/lib/image-export.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import * as htmlToImage from 'html-to-image';
import { exportNodeToPng } from '@/lib/image-export';

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,XXX'),
  toBlob: vi.fn().mockResolvedValue(new Blob(['x'], { type: 'image/png' })),
}));

describe('exportNodeToPng', () => {
  it('invokes toPng with pixelRatio 2 and 1080×1080 dimensions', async () => {
    const node = document.createElement('div');
    const url = await exportNodeToPng(node);
    expect(url).toBe('data:image/png;base64,XXX');
    expect(htmlToImage.toPng).toHaveBeenCalledWith(node, expect.objectContaining({
      pixelRatio: 2,
      width: 1080,
      height: 1080,
    }));
  });
});
```

- [ ] **Step 6: 失敗を確認**

Run: `npm test -- image-export`
Expected: FAIL

- [ ] **Step 7: 実装**

`lib/image-export.ts`:
```ts
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
```

- [ ] **Step 8: テスト通過確認**

Run: `npm test -- image-export`
Expected: 1 passed

- [ ] **Step 9: コミット**

```bash
git add -A
git commit -m "feat: add filename builder and html-to-image export wrapper"
```

---

### Task 22: DownloadButton

**Files:**
- Create: `components/Export/DownloadButton.tsx`
- Modify: `components/Preview/index.tsx`, `app/page.tsx`

- [ ] **Step 1: ref を上位に渡せるよう Preview を改修**

`components/Preview/index.tsx` で `Preview` を以下に変更:
```tsx
import { useRef } from 'react';
// PreviewCanvas は既に forwardRef 化済み

export function Preview({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section aria-label="プレビュー" className="w-full max-w-[540px] mx-auto">
      <div className="relative w-full overflow-hidden border rounded" style={{ aspectRatio: '1 / 1' }}>
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(0.5)' }}>
          <PreviewCanvas ref={canvasRef} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: app/page.tsx を Client 化して ref を作成・受け渡し**

`app/page.tsx`:
```tsx
'use client';
import { useRef } from 'react';
import { Form } from '@/components/Form';
import { Preview } from '@/components/Preview';
import { Footer } from '@/components/Footer';
import { ThemeSelector } from '@/components/Form/ThemeSelector';
import { InitialThemeModal } from '@/components/InitialThemeModal';
import { DownloadButton } from '@/components/Export/DownloadButton';

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
          <div className="flex gap-2">
            <DownloadButton canvasRef={canvasRef} />
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
```

- [ ] **Step 3: DownloadButton 実装**

`components/Export/DownloadButton.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { exportNodeToPng } from '@/lib/image-export';
import { buildFilename } from '@/lib/filename';

export function DownloadButton({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement> }) {
  const handle = useAppStore(s => s.form.handle);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!canvasRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await exportNodeToPng(canvasRef.current);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = buildFilename(handle);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={busy} className="flex-1">
      {busy ? '生成中...' : 'PNGをダウンロード'}
    </Button>
  );
}
```

- [ ] **Step 4: 手動確認**

Run: `npm run dev` → 入力 → ダウンロードボタン → 2160×2160 PNG が保存されることを確認。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "feat: add PNG download button (2160×2160)"
```

---

### Task 23: ShareButton（Web Share API + X intent）

**Files:**
- Create: `lib/share.ts`, `components/Export/ShareButton.tsx`, `tests/lib/share.test.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: share の失敗テスト**

`tests/lib/share.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildShareText, buildXIntentUrl } from '@/lib/share';

describe('share', () => {
  it('buildShareText composes message with hashtag and url', () => {
    expect(buildShareText('https://example.com')).toBe(
      'ポケチャン履歴書を作りました！\n#ポケチャン履歴書\nhttps://example.com'
    );
  });
  it('buildXIntentUrl URL-encodes the share text', () => {
    const url = buildXIntentUrl('hello world #tag');
    expect(url).toBe('https://x.com/intent/tweet?text=hello%20world%20%23tag');
  });
});
```

- [ ] **Step 2: 失敗を確認**

Run: `npm test -- share`
Expected: FAIL

- [ ] **Step 3: 実装**

`lib/share.ts`:
```ts
import { HASHTAG } from './constants/site';

export function buildShareText(siteUrl: string): string {
  return `ポケチャン履歴書を作りました！\n${HASHTAG}\n${siteUrl}`;
}

export function buildXIntentUrl(text: string): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function canUseWebShareWithFiles(): boolean {
  if (typeof navigator === 'undefined') return false;
  return typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [new File([new Blob(['x'])], 't.png', { type: 'image/png' })] });
}
```

- [ ] **Step 4: テスト通過確認**

Run: `npm test -- share`
Expected: 2 passed

- [ ] **Step 5: ShareButton 実装**

`components/Export/ShareButton.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportNodeToBlob } from '@/lib/image-export';
import { buildShareText, buildXIntentUrl, canUseWebShareWithFiles } from '@/lib/share';
import { useAppStore } from '@/lib/store';
import { buildFilename } from '@/lib/filename';
import { SITE_URL } from '@/lib/constants/site';

export function ShareButton({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement> }) {
  const handle = useAppStore(s => s.form.handle);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!canvasRef.current) return;
    setBusy(true);
    try {
      const blob = await exportNodeToBlob(canvasRef.current);
      const text = buildShareText(`https://${SITE_URL}`);
      const file = new File([blob], buildFilename(handle), { type: 'image/png' });

      if (canUseWebShareWithFiles()) {
        await navigator.share({ files: [file], text });
        return;
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.open(buildXIntentUrl(text), '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="secondary" onClick={onClick} disabled={busy} className="flex-1">
      {busy ? '生成中...' : 'Xでシェア'}
    </Button>
  );
}
```

- [ ] **Step 6: page.tsx に追加**

DownloadButton の隣に:
```tsx
import { ShareButton } from '@/components/Export/ShareButton';
// ...
<div className="flex gap-2">
  <DownloadButton canvasRef={canvasRef} />
  <ShareButton canvasRef={canvasRef} />
</div>
```

- [ ] **Step 7: 手動確認**

Run: `npm run dev`
- PC（Web Share未対応）: PNG ダウンロード + 新タブで X intent が開く
- モバイル（DevTools Device Mode で Safari/Chrome モバイル）: OS の共有シートが呼ばれる（実機推奨だが、最低限エラーなく動くことを確認）

- [ ] **Step 8: コミット**

```bash
git add -A
git commit -m "feat: add share button (Web Share API with X intent fallback)"
```

---

### Task 24: リセットボタン（確認ダイアログ）

**Files:**
- Create: `components/Form/ResetButton.tsx`
- Modify: `components/Form/index.tsx`

- [ ] **Step 1: 実装**

`components/Form/ResetButton.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';

export function ResetButton() {
  const reset = useAppStore(s => s.resetForm);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        入力をリセット
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>入力をすべて削除しますか？</DialogTitle></DialogHeader>
          <p className="text-sm text-neutral-600">
            ハンドル・推し・コメント等の入力内容が初期化されます。テーマ設定は保持されます。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button
              variant="destructive"
              onClick={() => { reset(); setOpen(false); }}
            >
              リセット
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

- [ ] **Step 2: shadcn の `destructive` バリアントが無ければ`button.tsx` のバリアントを確認**

shadcn の Button は標準で `destructive` を含む。なければ `<Button onClick={...} className="bg-red-600 text-white">` で代替。

- [ ] **Step 3: Form の末尾に配置**

`components/Form/index.tsx` で `import { ResetButton } from './ResetButton';` し、最後に:
```tsx
<div className="pt-4 border-t">
  <ResetButton />
</div>
```

- [ ] **Step 4: 手動確認**

入力 → リセット押下 → 確認 → フォームがクリアされ、テーマは保持されること。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "feat: add reset button with confirmation dialog"
```

---

### Task 25: 最終結合確認 + アクセシビリティ・モバイル動作チェック

**Files:**
- 必要に応じて: `app/globals.css`, 各テーマ, `components/Preview/index.tsx`

- [ ] **Step 1: 全 14 フィールドが入力可能であること、ストアに反映されること、リロード後に復元されること（iconDataUrl 除く）を一通りスモークテスト**

Run: `npm run dev`、以下を順に確認:
- 必須 5 (handle / icon / oshiPokemon / battleOshi / comment) を入力 → プレビュー反映
- 任意 9 を埋める → プレビュー反映
- リロード → icon 以外復元
- テーマ切替 → 入力保持
- リセット → クリア（テーマ保持）

- [ ] **Step 2: 3 テーマすべてでダウンロード PNG を確認**

各テーマで「PNGをダウンロード」→ 保存された画像が 2160×2160px であること、右下にクレジット表記があることを確認。

- [ ] **Step 3: モバイル幅（375×667）動作確認**

DevTools Device Mode で:
- プレビューが画面上部に sticky
- フォームがスクロール可能
- ダウンロードボタンが押せる
- フォントサイズ・タップターゲットに違和感がない

- [ ] **Step 4: 残った見た目の調整（必要なら）**

気になる箇所のスペーシング・色味・フォントウェイトを微調整。設計に反する変更（カラーバリエ追加など）はしない。

- [ ] **Step 5: テスト全件パス & ビルド成功確認**

Run: `npm test`
Expected: 全 passed

Run: `npm run build`
Expected: 成功

- [ ] **Step 6: コミット（あれば）**

```bash
git add -A
git commit -m "chore: final polish and integration verification"
```

---

### Task 26: Vercel デプロイ準備 & README

**Files:**
- Create: `README.md`, `vercel.json`（必要時のみ）
- Modify: なし or `package.json`

- [ ] **Step 1: README を書く**

`README.md`:
```markdown
# ポケチャン履歴書メーカー

ポケモンチャンピオンズのプレイヤー向け、自己紹介画像（履歴書）作成 Web ツール。

## 開発

\`\`\`bash
npm install
npm run data:generate   # 初回のみ：data/pokemon-*.json を生成
npm run dev
\`\`\`

## テスト

\`\`\`bash
npm test
\`\`\`

## ビルド

\`\`\`bash
npm run build
\`\`\`

## デプロイ

GitHub に push すると Vercel が自動デプロイ。

## 法務

公式ポケモン画像・素材は使用していません。ポケモン名はテキストとして使用しています。
アップロード画像の著作権はユーザーに帰属し、その責任もユーザーが負います。
本ツールは非公式の二次創作支援ツールです。
```

- [ ] **Step 2: Vercel CLI で動作確認（任意 / ユーザー判断）**

ユーザーに「Vercel にデプロイしますか？」と確認したうえで:
```bash
npx vercel --prod
```
（ユーザーの承認なしには実行しない。代わりに GitHub への push を案内する。）

- [ ] **Step 3: コミット**

```bash
git add -A
git commit -m "docs: add README with dev/build/deploy instructions"
```

---

## 3. セルフレビュー結果

**Spec coverage チェック:**

| 仕様要件 | 担当タスク |
|---|---|
| 14 入力フィールド（必須5 / 任意9） | Task 8〜15, 24 |
| ポケモン選択UI（211/1050 切替・検索・チップ） | Task 10, 11 |
| ランク階層選択 | Task 12 |
| 3 デザインテーマ | Task 17, 18, 19 |
| シングルページ・2 カラム / モバイル sticky | Task 7 |
| 初回テーマ選択モーダル | Task 20 |
| ライブプレビュー | Task 16〜19 |
| localStorage 自動保存（iconDataUrl 除外） | Task 6 |
| 2160×2160 PNG 書き出し | Task 21, 22 |
| ファイル名規約 | Task 21 |
| クレジット右下表記 | Task 16 |
| Web Share API + X intent | Task 23 |
| 法務免責表示（フッタ） | Task 7 |
| 公式アセット非使用 | 全テーマ（Task 17〜19）で自前スタイルのみ |
| リセットボタン | Task 24 |
| Vercel デプロイ | Task 26 |

**Placeholder スキャン:** TBD / TODO / 「適切なエラーハンドリングを追加」等は使用していない。全ステップにコード/コマンドあり。

**型一貫性:** `ResumeForm`（Task 6）の型に対し、各 Picker のシグネチャ（`PokemonPicker.onChange: (next: string[]) => void`、`RankPicker.onChange: (v: { tier; step } | null) => void` 等）が一致。`useAppStore.updateForm` の `Partial<ResumeForm>` 経由で整合。`exportNodeToPng` / `exportNodeToBlob` の名称は Task 21・22・23 で一致。

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-14-pokechan-resume-maker.md`. Two execution options:**

1. **Subagent-Driven (recommended)** — 各タスクごとに新しいサブエージェントを起動し、間でレビューを挟む。高速イテレーション。
2. **Inline Execution** — このセッション内で executing-plans skill を使い、チェックポイントごとに確認しながら実行。

**Which approach?**
