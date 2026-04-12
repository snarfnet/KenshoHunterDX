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
        background: "rgba(255, 255, 255, 0.92)",
        borderBottom: "1.5px solid #f0e6d8",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          <span style={{ fontSize: "1.6rem" }}>🐱</span>
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#3a3030",
              letterSpacing: "0.02em",
            }}
          >
            懸賞ハンター
            <span
              style={{
                background: "linear-gradient(135deg, #e8739a, #f5a623)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginLeft: 2,
              }}
            >
              DX
            </span>
          </span>
        </a>

        <nav className="hidden sm:flex items-center gap-6">
          <a
            href="/"
            style={{
              fontSize: "0.82rem",
              color: "#7a6e6e",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            ホーム
          </a>
          <a
            href="#about"
            style={{
              fontSize: "0.82rem",
              color: "#7a6e6e",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            サイトについて
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "#faf6f0",
        borderTop: "1.5px solid #f0e6d8",
        marginTop: "auto",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "1.2rem" }}>🐱</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#3a3030",
              }}
            >
              懸賞ハンターDX
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#b0a4a4" }}>
            &copy; 2026 懸賞ハンターDX. All rights reserved.
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            letterSpacing: "0.5em",
            opacity: 0.15,
            marginBottom: "0.75rem",
          }}
        >
          🐾🐾🐾🐾🐾
        </div>
        <p
          style={{
            fontSize: "0.72rem",
            color: "#b0a4a4",
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9404799280370656"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
