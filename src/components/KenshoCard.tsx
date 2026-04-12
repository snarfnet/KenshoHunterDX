import Link from "next/link";
import type { Kensho } from "@/lib/types";
import { daysUntilDeadline, formatDeadline, isClosingSOon } from "@/lib/kensho";
import { withAffiliate } from "@/lib/affiliate";

const CATEGORY_COLORS: Record<string, string> = {
  食品: "bg-green-100 text-green-700",
  家電: "bg-blue-100 text-blue-700",
  コスメ: "bg-pink-100 text-pink-700",
  旅行: "bg-sky-100 text-sky-700",
  ギフト券: "bg-purple-100 text-purple-700",
  ゲーム: "bg-orange-100 text-orange-700",
  その他: "bg-gray-100 text-gray-600",
};

const CATEGORY_ICONS: Record<string, string> = {
  食品: "🍱",
  家電: "📺",
  コスメ: "💄",
  旅行: "✈️",
  ギフト券: "🎁",
  ゲーム: "🎮",
  その他: "🎯",
};

const ENTRY_METHOD_COLORS: Record<string, string> = {
  Twitter: "bg-sky-500",
  LINE: "bg-green-500",
  Web: "bg-amber-500",
};

interface Props {
  kensho: Kensho;
}

export default function KenshoCard({ kensho }: Props) {
  const days = daysUntilDeadline(kensho.deadline);
  const closing = isClosingSOon(kensho.deadline);
  const url = withAffiliate(kensho.url);
  const catColor = CATEGORY_COLORS[kensho.category] ?? "bg-gray-100 text-gray-600";
  const catIcon = CATEGORY_ICONS[kensho.category] ?? "🎯";
  const methodColor = ENTRY_METHOD_COLORS[kensho.entryMethod] ?? "bg-gray-400";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-yellow-100">
      {/* カラーバナー */}
      <div className="relative h-28 bg-gradient-to-br from-yellow-300 via-amber-200 to-yellow-100 flex items-center justify-center">
        <span className="text-5xl">{catIcon}</span>
        {closing && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            まもなく終了
          </span>
        )}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${catColor}`}
        >
          {kensho.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link href={`/kensho/${kensho.id}`} className="group">
          <h2 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2">
            {kensho.title}
          </h2>
        </Link>

        <p className="text-gray-500 text-xs line-clamp-2">{kensho.description}</p>

        <div className="bg-yellow-50 rounded-lg px-3 py-2 text-xs text-gray-700 font-medium border border-yellow-200">
          <span className="text-yellow-600 font-bold">賞品: </span>
          {kensho.prize}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">締切: </span>
            {formatDeadline(kensho.deadline)}
            <span className={`ml-1 font-bold ${days <= 3 ? "text-red-500" : "text-gray-400"}`}>
              （残{days}日）
            </span>
          </div>
          <span
            className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${methodColor}`}
          >
            {kensho.entryMethod}
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-center bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-2 rounded-xl text-sm transition-all duration-200 shadow hover:shadow-md"
        >
          応募する →
        </a>
      </div>
    </div>
  );
}
