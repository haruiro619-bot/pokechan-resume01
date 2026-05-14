import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ポケチャン履歴書メーカー",
  description: "ポケモンチャンピオンズの自己紹介画像を作成するツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
