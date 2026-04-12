"use client";

import { useState, useMemo } from "react";
import type { Kensho, Category } from "@/lib/types";
import { ALL_CATEGORIES } from "@/lib/types";
import { daysUntilDeadline } from "@/lib/kensho";
import KenshoCard from "./KenshoCard";

interface Props {
  kenshoList: Kensho[];
}

type SortKey = "deadline" | "createdAt";

export default function KenshoList({ kenshoList }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "全て">("全て");
  const [sortKey, setSortKey] = useState<SortKey>("deadline");

  const filtered = useMemo(() => {
    let list =
      selectedCategory === "全て"
        ? kenshoList
        : kenshoList.filter((k) => k.category === selectedCategory);

    if (sortKey === "deadline") {
      list = [...list].sort(
        (a, b) =>
          daysUntilDeadline(a.deadline) - daysUntilDeadline(b.deadline)
      );
    } else {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return list;
  }, [kenshoList, selectedCategory, sortKey]);

  const categoryButtons: Array<Category | "全て"> = ["全て", ...ALL_CATEGORIES];

  return (
    <div>
      {/* フィルター＆ソート */}
      <div id="categories" className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {categoryButtons.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | "全て")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-yellow-400 text-white border-yellow-400 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:border-yellow-400 hover:text-yellow-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">並び替え:</span>
          <button
            onClick={() => setSortKey("deadline")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              sortKey === "deadline"
                ? "bg-amber-400 text-white border-amber-400"
                : "bg-white text-gray-500 border-gray-300 hover:border-amber-400"
            }`}
          >
            締切順
          </button>
          <button
            onClick={() => setSortKey("createdAt")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              sortKey === "createdAt"
                ? "bg-amber-400 text-white border-amber-400"
                : "bg-white text-gray-500 border-gray-300 hover:border-amber-400"
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

      {/* グリッド */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">😢</div>
          <p className="text-lg font-medium">該当する懸賞がありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((k) => (
            <KenshoCard key={k.id} kensho={k} />
          ))}
        </div>
      )}
    </div>
  );
}
