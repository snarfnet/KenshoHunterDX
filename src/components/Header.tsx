import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-yellow-500 fill-current"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-black text-xl leading-none drop-shadow">
              懸賞ハンターDX
            </div>
            <div className="text-yellow-100 text-xs font-medium">
              お得な懸賞情報をまとめてお届け
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white font-semibold hover:text-yellow-100 transition-colors text-sm"
          >
            トップ
          </Link>
          <Link
            href="/#categories"
            className="text-white font-semibold hover:text-yellow-100 transition-colors text-sm hidden sm:block"
          >
            カテゴリ
          </Link>
        </nav>
      </div>
    </header>
  );
}
