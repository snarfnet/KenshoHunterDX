import { notFound } from "next/navigation";
import kenshoData from "@/data/kensho.json";
import type { Kensho } from "@/lib/types";
import { withAffiliate } from "@/lib/affiliate";
import { formatDeadline, daysUntilDeadline, isClosingSOon } from "@/lib/kensho";

const allKensho = kenshoData as Kensho[];

const METHOD_COLORS: Record<string, string> = {
  Twitter: "bg-sky-100 text-sky-700",
  Web: "bg-green-100 text-green-700",
  LINE: "bg-emerald-100 text-emerald-700",
};

const CATEGORY_EMOJI: Record<string, string> = {
  食品: "🍽️",
  家電: "📺",
  コスメ: "💄",
  旅行: "✈️",
  ギフト券: "🎫",
  ゲーム: "🎮",
  その他: "📦",
};

export function generateStaticParams() {
  return allKensho.map((k) => ({ id: k.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const k = allKensho.find((item) => item.id === params.id);
  if (!k) return { title: "懸賞が見つかりません | 懸賞ハンターDX" };
  return {
    title: `${k.title} | 懸賞ハンターDX`,
    description: k.description,
    openGraph: {
      title: k.title,
      description: k.description,
      type: "article",
      locale: "ja_JP",
    },
  };
}

export default async function KenshoDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const k = allKensho.find((item) => item.id === id);
  if (!k) notFound();

  const days = daysUntilDeadline(k.deadline);
  const closing = isClosingSOon(k.deadline);
  const affiliateUrl = withAffiliate(k.url);

  const related = allKensho
    .filter((item) => item.id !== k.id && item.category === k.category)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* AdSense広告枠（ヘッダー下） */}
      <div className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm mb-8">
        📢 広告枠（AdSense）
      </div>

      {/* パンくず */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-amber-600 transition">
          ホーム
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{k.title}</span>
      </nav>

      <div className="lg:flex gap-8">
        {/* メインコンテンツ */}
        <article className="flex-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* カテゴリ帯 */}
            <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-6 py-3 flex items-center justify-between">
              <span className="text-white font-bold">
                {CATEGORY_EMOJI[k.category]} {k.category}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  METHOD_COLORS[k.entryMethod] || "bg-gray-100 text-gray-600"
                }`}
              >
                {k.entryMethod}で応募
              </span>
            </div>

            <div className="p-6 space-y-6">
              <h1 className="text-2xl font-bold text-gray-800 leading-snug">
                {k.title}
              </h1>

              {/* ステータス */}
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm text-gray-500">
                  📅 締切: {formatDeadline(k.deadline)}
                </span>
                {closing && (
                  <span className="text-xs font-bold text-white bg-red-500 px-3 py-1 rounded-full animate-pulse">
                    ⏰ まもなく終了！
                  </span>
                )}
                {!closing && days <= 7 && (
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    あと{days}日
                  </span>
                )}
              </div>

              {/* 賞品 */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h2 className="text-sm font-bold text-amber-700 mb-1">
                  🎁 賞品
                </h2>
                <p className="text-lg font-bold text-gray-800">{k.prize}</p>
              </div>

              {/* 説明 */}
              <div>
                <h2 className="text-sm font-bold text-gray-600 mb-2">
                  📝 キャンペーン詳細
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {k.description}
                </p>
              </div>

              {/* 詳細情報 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500">主催者</span>
                  <p className="font-medium text-gray-800 mt-1">{k.sponsor}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500">応募方法</span>
                  <p className="font-medium text-gray-800 mt-1">
                    {k.entryMethod}
                  </p>
                </div>
              </div>

              {/* 応募ボタン */}
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition text-lg"
              >
                🚀 応募ページへ
              </a>
            </div>
          </div>

          {/* AdSense広告枠（記事下） */}
          <div className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm mt-8">
            📢 広告枠（AdSense）
          </div>
        </article>

        {/* サイドバー */}
        <aside className="lg:w-72 mt-8 lg:mt-0 space-y-6">
          {/* AdSense広告枠（サイドバー） */}
          <div className="w-full h-60 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            📢 広告枠（AdSense）
          </div>

          {/* 関連懸賞 */}
          {related.length > 0 && (
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold text-gray-800 mb-3">
                同じカテゴリの懸賞
              </h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <a
                    key={r.id}
                    href={`/kensho/${r.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition"
                  >
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {formatDeadline(r.deadline)}まで
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* 戻るリンク */}
      <div className="mt-8">
        <a
          href="/"
          className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium transition"
        >
          ← 懸賞一覧に戻る
        </a>
      </div>
    </div>
  );
}
