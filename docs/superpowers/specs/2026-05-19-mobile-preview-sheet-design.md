# モバイルプレビュー ボトムシート設計

**日付**: 2026-05-19  
**対象**: ポケチャン履歴書メーカー

---

## 背景・課題

モバイル表示時、プレビューが `sticky top-0` で画面上半分を占有し、フォームの操作性が著しく低下している。プレビューは「入力しながら常に確認する」用途ではなく「できた！確認したい」という瞬間に使うものであるため、常時表示よりも必要時のみ表示する設計が適切。

---

## ゴール

- モバイルでフォームが全画面で使えるようにする
- プレビューはタップ1回で大きく・きれいに確認できる
- ダウンロード・シェアはプレビューと同じ画面から実行できる
- デスクトップのレイアウトは一切変更しない

---

## スコープ外

- デスクトップ（md以上）のレイアウト変更
- プレビューのデザイン・テーマ変更
- ダウンロード・シェアのロジック変更

---

## UXフロー（モバイル）

```
フォーム記入（全画面）
    ↓
画面下部に固定ボタン「👁 プレビューを見る」が常時表示
    ↓ タップ
ボトムシートが下から上にスライドイン（画面の約95%高さ）
  ┌──────────────────────────┐
  │  ━━━  (ドラッグハンドル)  │
  │  [×]                     │
  │  プレビュー（全幅 1:1）   │
  │  [ダウンロード] [シェア]  │
  └──────────────────────────┘
    ↓ 閉じる（× or 背景タップ）
フォームに戻る
```

---

## コンポーネント設計

### 1. `components/Preview/MobilePreviewSheet.tsx`（新規）

**役割**: モバイル専用のボトムシート。常にDOMに存在し、`open` フラグで表示/非表示を切り替える。

**Props**:
```ts
interface Props {
  open: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}
```

**実装方針**:
- `fixed inset-0 z-50 md:hidden` — モバイルのみ、全画面オーバーレイ
- `pointerEvents`: open時のみ有効（閉じている間も DOM に存在し canvasRef を保持）
- 背景: 半透明黒 (`bg-black/60`)、フェードイン/アウト
- シート本体: `rounded-t-3xl bg-white`、`translateY(0)` ↔ `translateY(100%)` でスライド
- アニメーション: `transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)`
- 内容: ドラッグハンドル（装飾のみ）、×ボタン、`<Preview canvasRef={canvasRef} />`、`<DownloadButton>`、`<ShareButton>`
- 背景タップで閉じる

**export（html-to-image）との互換性**:
シートは `display:none` を使わず `translateY` で非表示にするため、`canvasRef` が指す `PreviewCanvas` DOM要素は常にレンダリングされた状態を維持する。

### 2. `components/Preview/index.tsx`（変更）

`Preview` コンポーネントの `canvasRef` prop を optional に変更する。

```ts
// 変更前
function Preview({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> })

// 変更後
function Preview({ canvasRef }: { canvasRef?: React.RefObject<HTMLDivElement | null> })
```

デスクトップ表示用の `<Preview />` は ref なしで呼び出し、描画のみ行う。`forwardRef` は null ref を正常に処理するため追加実装不要。

### 3. `app/page.tsx`（変更）

**追加**:
- `previewOpen: boolean` state
- `<MobilePreviewSheet open={previewOpen} onClose={...} canvasRef={canvasRef} />`
- モバイル用固定フッターボタン

**削除**:
- モバイルでの sticky プレビューブロック（`<Preview canvasRef={canvasRef} />` + ボタン群）
  → デスクトップのみ表示に変更（`hidden md:block`）

**固定フッターボタン**:
- `fixed bottom-0 inset-x-0 md:hidden z-40`
- iPhone セーフエリア対応: `pb-[env(safe-area-inset-bottom)]`
- デザイン: 全幅、赤系グラデーション、`font-bold`、「👁 プレビューを見る」

---

## レイアウト変更まとめ

| 要素 | モバイル | デスクトップ |
|---|---|---|
| サイドパネル（Preview + ボタン） | 非表示 (`hidden md:block`) | 現状維持（sticky） |
| `canvasRef` の場所 | MobilePreviewSheet 内（常にDOMに存在） | サイドパネル内 Preview |
| プレビュー確認手段 | 固定ボタン → ボトムシート | 常時表示 |
| ダウンロード・シェア | ボトムシート内 | サイドパネル内（現状維持） |

---

## 変更ファイル一覧

| ファイル | 変更種別 |
|---|---|
| `components/Preview/MobilePreviewSheet.tsx` | 新規作成 |
| `components/Preview/index.tsx` | `canvasRef` を optional に |
| `app/page.tsx` | レイアウト再編 |
