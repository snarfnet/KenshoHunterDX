export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-white font-bold text-lg">懸賞ハンターDX</div>
            <div className="text-gray-400 text-sm mt-1">
              お得な懸賞・プレゼント情報をまとめてお届けするサイトです。
            </div>
          </div>
          <div className="text-gray-400 text-xs text-center md:text-right">
            <p>掲載情報は各懸賞の公式サイトをご確認ください。</p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} 懸賞ハンターDX. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
