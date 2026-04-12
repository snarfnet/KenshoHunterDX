"use client";

import { useState, useMemo } from "react";
import kenshoData from "@/data/kensho.json";
import type { Kensho, Category } from "@/lib/types";
import { ALL_CATEGORIES } from "@/lib/types";
import { withAffiliate } from "@/lib/affiliate";
import { daysUntilDeadline, isClosingSOon, formatDeadline } from "@/lib/kensho";

type SortMode = "deadline" | "newest";

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("deadline");

  const activeKensho = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (kenshoData as Kensho[]).filter((k) => {
      const deadline = new Date(k.deadline);
      deadline.setHours(23, 59, 59, 999);
      return deadline >= today;
    });
  }, []);

  const filtered = useMemo(() => {
    let list =
      selectedCategory === "all"
        ? activeKensho
        : activeKensho.filter((k) => k.category === selectedCategory);

    list = [...list].sort((a, b) => {
      if (sortMode === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [activeKensho, selectedCategory, sortMode]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* AdSense広告枠（ヘッダー下） */}
      <div className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm mb-8">
        📢 広告枠（AdSense）
      </div>

      {/* ヒーロー */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎯 お得な懸賞情報を毎日更新！
        </h2>
        <p className="text-gray-500">
          Twitter・Web・LINEの最新キャンペーンをまとめてチェック
        </p>
      </div>

      {/* フィルター＋ソート */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === "all"
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-300 hover:border-amber-400"
            }`}
          >
            すべて
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-amber-400"
              }`}
            >
              {CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortMode("deadline")}
            className={`px-3 py-1.5 rounded text-sm transition ${
              sortMode === "deadline"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            締切が近い順
          </button>
          <button
            onClick={() => setSortMode("newest")}
            className={`px-3 py-1.5 rounded text-sm transition ${
              sortMode === "newest"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            新着順
          </button>
        </div>
      </div>

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length}件の懸賞が見つかりました
      </p>

      {/* カード一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((k) => {
          const days = daysUntilDeadline(k.deadline);
          const closing = isClosingSOon(k.deadline);
          return (
            <a
              key={k.id}
              href={`/kensho/${k.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group"
            >
              {/* カテゴリ帯 */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2 flex items-center justify-between">
                <span className="text-white font-bold text-sm">
                  {CATEGORY_EMOJI[k.category]} {k.category}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    METHOD_COLORS[k.entryMethod] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {k.entryMethod}
                </span>
              </div>

              {/* コンテンツ */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-800 group-hover:text-amber-600 transition line-clamp-2 leading-snug">
                  {k.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {k.description}
                </p>
                <div className="text-xs text-gray-400">
                  提供: {k.sponsor}
                </div>
                <div className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                  🎁 {k.prize}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    📅 {formatDeadline(k.deadline)}まで
                  </span>
                  {closing && (
                    <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse">
                      ⏰ まもなく終了
                    </span>
                  )}
                  {!closing && days <= 7 && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                      あと{days}日
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>該当する懸賞が見つかりませんでした</p>
        </div>
      )}

      {/* AdSense広告枠（一覧下） */}
      <div className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm mt-8">
        📢 広告枠（AdSense）
      </div>

      {/* About */}
      <section id="about" className="mt-16 mb-8 bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          懸賞ハンターDXについて
        </h2>
        <p className="text-gray-600 leading-relaxed">
          懸賞ハンターDXは、Twitter・Web・LINEなどの最新懸賞・プレゼントキャンペーン情報を
          まとめてお届けする情報サイトです。毎日更新される懸賞情報の中から、カテゴリや締切で
          簡単に絞り込んで、気になるキャンペーンにすぐ応募できます。
        </p>
      </section>
    </div>
  );
}
