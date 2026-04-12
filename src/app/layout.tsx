import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "懸賞ハンターDX | 最新懸賞・プレゼント情報まとめ",
  description:
    "最新の懸賞・プレゼントキャンペーン情報を毎日更新！Twitter懸賞・Web応募・LINE懸賞など、お得な情報をまとめてお届けします。",
  openGraph: {
    title: "懸賞ハンターDX | 最新懸賞・プレゼント情報まとめ",
    description:
      "最新の懸賞・プレゼントキャンペーン情報を毎日更新！",
    type: "website",
    locale: "ja_JP",
  },
};

function Header() {
  return (
    <header className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          <h1 className="text-2xl font-bold text-white drop-shadow-md tracking-wide">
            懸賞ハンターDX
          </h1>
        </a>
        <nav className="hidden sm:flex gap-6 text-white font-medium text-sm">
          <a href="/" className="hover:text-yellow-100 transition">
            ホーム
          </a>
          <a href="#about" className="hover:text-yellow-100 transition">
            サイトについて
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bold text-white">懸賞ハンターDX</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; 2026 懸賞ハンターDX. All rights reserved.
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          ※当サイトに掲載されている懸賞情報は各主催者の公式情報に基づいています。
          応募の際は各キャンペーンの公式ページで最新の情報をご確認ください。
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
