import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "懸賞ハンターDX | 最新懸賞・プレゼント情報まとめ",
  description:
    "最新の懸賞・プレゼントキャンペーン情報を毎日更新！Twitter懸賞・Web応募・LINE懸賞など、お得な情報をまとめてお届けします。",
  openGraph: {
    title: "懸賞ハンターDX | 最新懸賞・プレゼント情報まとめ",
    description: "最新の懸賞・プレゼントキャンペーン情報を毎日更新！",
    type: "website",
    locale: "ja_JP",
  },
};

function Header() {
  return (
    <header
      style={{
        background: "rgba(15, 15, 26, 0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          {/* Logo mark */}
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #c9a227, #f0c841)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              boxShadow: "0 0 16px rgba(212,175,55,0.4)",
              flexShrink: 0,
            }}
          >
            ◆
          </div>
          <span
            style={{
              fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#f0ede6",
            }}
          >
            懸賞ハンター
            <span
              style={{
                color: "#d4af37",
                textShadow: "0 0 16px rgba(212,175,55,0.5)",
                marginLeft: 1,
              }}
            >
              DX
            </span>
          </span>
        </a>

        <nav className="hidden sm:flex items-center gap-6">
          <a href="/" className="nav-link">ホーム</a>
          <a href="#about" className="nav-link">サイトについて</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "rgba(10, 10, 18, 0.9)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        marginTop: "auto",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 24,
                height: 24,
                background: "linear-gradient(135deg, #c9a227, #f0c841)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "#0f0f1a",
              }}
            >
              ◆
            </div>
            <span
              style={{
                fontFamily:
                  "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#f0ede6",
                letterSpacing: "0.05em",
              }}
            >
              懸賞ハンターDX
            </span>
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(90,86,106,1)",
              letterSpacing: "0.03em",
            }}
          >
            &copy; 2026 懸賞ハンターDX. All rights reserved.
          </p>
        </div>
        <p
          style={{
            fontSize: "0.7rem",
            color: "rgba(90,86,106,0.8)",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
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
      <body className="min-h-full flex flex-col" style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
