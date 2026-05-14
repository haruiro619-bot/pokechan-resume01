@AGENTS.md

# ツール実行ルール（確認不要 / 要確認）

## 確認なしで実行してよいもの
- ファイル読み書き・編集（Read, Write, Edit）
- `npm test`, `npm run build`, `npx`（外部接続なし）
- `git add`, `git commit`（ローカルのみ）

## 必ずユーザーに確認してから実行するもの
- `npm install`（npm レジストリへの外部接続）
- `git push`（リモートリポジトリへの接続）
- `rm` / ファイル削除コマンド
