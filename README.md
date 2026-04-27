# URL短縮サービス - フロントエンド

React + TypeScript + Vite で構築したURL短縮サービスのフロントエンドです。

## デモ

https://change-url-front.onrender.com

## 技術スタック

- React 19
- TypeScript
- Vite
- react-router-dom
- Render（デプロイ）

## 機能

- ログイン・新規登録
- URL作成・一覧表示・削除
- ログアウト

## 画面構成

| パス | 画面 | 認証 |
|---|---|---|
| /login | ログイン | 不要 |
| /register | 新規登録 | 不要 |
| / | メイン画面（URL作成・一覧） | 必要 |

## ローカル起動

```bash
# パッケージインストール
npm install

# 環境変数設定
cp .env.example .env

# 起動
npm run dev
```

## 環境変数

| 変数名 | 説明 |
|---|---|
| VITE_API_BASE_URL | バックエンドのURL |
| VITE_USE_MOCK | モックモード（1で有効） |
