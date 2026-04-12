"use client";

import { useState, useMemo, useEffect } from "react";
import kenshoData from "@/data/kensho.json";
import type { Kensho, Category } from "@/lib/types";
import { ALL_CATEGORIES } from "@/lib/types";
import { daysUntilDeadline, isClosingSOon, formatDeadline } from "@/lib/kensho";

type SortMode = "deadline" | "newest";

const METHOD_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  Twitter: { label: "X / Twitter", color: "#1d9bf0", bg: "#e8f5fd" },
  Web: { label: "Web", color: "#43a047", bg: "#e8f5e9" },
  LINE: { label: "LINE", color: "#06c755", bg: "#e8f8ed" },
};

const CATEGORY_ICON: Record<string, string> = {
  食品: "🍽",
  家電: "📺",
  コスメ: "💄",
  旅行: "✈️",
  ギフト券: "🎫",
  ゲーム: "🎮",
  その他: "📦",
};

const CAT_COMMENTS = [
  "今日もお得にゃ〜🐱",
  "にゃんと！素敵な懸賞がいっぱい🐾",
  "見逃さないにゃ〜✨",
  "当たりますように…🐱🍀",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("deadline");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allData = kenshoData as Kensho[];

  const filtered = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let list = allData.filter((k) => {
      const deadline = new Date(k.deadline);
      deadline.setHours(23, 59, 59, 999);
      return deadline >= today;
    });

    if (selectedCategory !== "all") {
      list = list.filter((k) => k.category === selectedCategory);
    }

    list = [...list].sort((a, b) => {
      if (sortMode === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [allData, selectedCategory, sortMode, mounted]);

  const catComment = CAT_COMMENTS[Math.floor(Math.random() * CAT_COMMENTS.length)];

  return (
    <div>
      {/* Ad top */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="ad-placeholder flex items-center justify-center text-sm" style={{ height: 80 }}>
          広告枠
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "2.5rem",
          paddingBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Paw prints decoration */}
        <div style={{ position: "absolute", top: 10, left: "10%", opacity: 0.06, fontSize: "2rem", transform: "rotate(-20deg)" }}>🐾</div>
        <div style={{ position: "absolute", top: 40, right: "12%", opacity: 0.06, fontSize: "1.8rem", transform: "rotate(15deg)" }}>🐾</div>
        <div style={{ position: "absolute", bottom: 10, left: "25%", opacity: 0.06, fontSize: "1.5rem", transform: "rotate(-10deg)" }}>🐾</div>
        <div style={{ position: "absolute", bottom: 20, right: "20%", opacity: 0.06, fontSize: "2.2rem", transform: "rotate(25deg)" }}>🐾</div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6" style={{ position: "relative" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🐱</div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              fontWeight: 800,
              color: "#3a3030",
              lineHeight: 1.4,
              marginBottom: "0.6rem",
            }}
          >
            お得な懸賞情報を、毎日更新
            <span style={{ color: "#e8739a" }}>。</span>
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "#7a6e6e",
              lineHeight: 1.8,
              marginBottom: "0.5rem",
            }}
          >
            Twitter・Web・LINEの最新キャンペーンをまとめてチェック
          </p>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#e8739a",
              fontWeight: 600,
            }}
          >
            {catComment}
          </p>
        </div>
      </div>

      {/* Filters + Sort + Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "filter-pill-active" : "filter-pill"}
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.82rem", fontWeight: selectedCategory === "all" ? 700 : 500 }}
          >
            🐱 すべて
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "filter-pill-active" : "filter-pill"}
              style={{ padding: "0.45rem 1.1rem", fontSize: "0.82rem", fontWeight: selectedCategory === cat ? 700 : 500 }}
            >
              {CATEGORY_ICON[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.82rem", color: "#7a6e6e" }}>
            <span style={{ color: "#e8739a", fontWeight: 700 }}>{filtered.length}</span> 件の懸賞が見つかったにゃ🐾
          </p>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={() => setSortMode("deadline")}
              className={sortMode === "deadline" ? "sort-btn-active" : "sort-btn"}
              style={{ padding: "0.35rem 0.9rem", fontSize: "0.78rem" }}
            >
              締切が近い順
            </button>
            <button
              onClick={() => setSortMode("newest")}
              className={sortMode === "newest" ? "sort-btn-active" : "sort-btn"}
              style={{ padding: "0.35rem 0.9rem", fontSize: "0.78rem" }}
            >
              新着順
            </button>
          </div>
        </div>

        {/* Card grid */}
        {!mounted ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#b0a4a4" }}>
            <span style={{ fontSize: "2rem" }}>🐱</span>
            <p style={{ marginTop: "0.5rem" }}>読み込み中にゃ...</p>
          </div>
        ) : (
        <div
          key={`${selectedCategory}-${sortMode}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((k) => {
            const days = daysUntilDeadline(k.deadline);
            const closing = isClosingSOon(k.deadline);
            const method = METHOD_LABELS[k.entryMethod];

            return (
              <a
                key={k.id}
                href={`/kensho/${k.id}`}
                className="cute-card"
                style={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {/* Card top */}
                <div
                  style={{
                    padding: "0.6rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f5ede3",
                    background: "#fdf8f2",
                  }}
                >
                  <span style={{ fontSize: "0.76rem", color: "#e8739a", fontWeight: 700 }}>
                    {CATEGORY_ICON[k.category]} {k.category}
                  </span>
                  {method && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.6rem",
                        borderRadius: 999,
                        color: method.color,
                        background: method.bg,
                      }}
                    >
                      {method.label}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: "0.9rem 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.55rem", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      color: "#3a3030",
                      lineHeight: 1.55,
                    }}
                    className="line-clamp-2"
                  >
                    {k.title}
                  </h3>

                  <p style={{ fontSize: "0.78rem", color: "#7a6e6e", lineHeight: 1.6 }} className="line-clamp-2">
                    {k.description}
                  </p>

                  <div style={{ fontSize: "0.7rem", color: "#b0a4a4" }}>
                    提供: {k.sponsor}
                  </div>

                  {/* Prize */}
                  <div
                    style={{
                      padding: "0.45rem 0.8rem",
                      borderRadius: 10,
                      background: "#fff8f0",
                      border: "1px solid #f5e0c0",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#d4880f",
                    }}
                  >
                    🎁 {k.prize}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <span style={{ fontSize: "0.72rem", color: "#b0a4a4" }}>
                      📅 {formatDeadline(k.deadline)}まで
                    </span>
                    {closing ? (
                      <span
                        className="badge-pulse"
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#ef5350",
                          background: "#ffebee",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 999,
                          border: "1px solid #ffcdd2",
                        }}
                      >
                        🔥 まもなく終了
                      </span>
                    ) : days <= 7 ? (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#f57c00",
                          background: "#fff3e0",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 999,
                          border: "1px solid #ffe0b2",
                        }}
                      >
                        あと{days}日
                      </span>
                    ) : null}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        )}

        {mounted && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#b0a4a4" }}>
            <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>😿</p>
            <p style={{ fontSize: "0.9rem" }}>該当する懸賞が見つからなかったにゃ...</p>
          </div>
        )}

        {/* Ad bottom */}
        <div className="ad-placeholder flex items-center justify-center text-sm mt-8" style={{ height: 80 }}>
          広告枠
        </div>

        {/* About */}
        <section
          id="about"
          className="cute-card"
          style={{
            marginTop: "2.5rem",
            marginBottom: "2rem",
            padding: "2rem 2rem",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#3a3030", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🐱</span> 懸賞ハンターDXについて
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#7a6e6e", lineHeight: 2 }}>
            懸賞ハンターDXは、Twitter・Web・LINEなどの最新懸賞・プレゼントキャンペーン情報を
            まとめてお届けする情報サイトです。毎日更新される懸賞情報の中から、カテゴリや締切で
            簡単に絞り込んで、気になるキャンペーンにすぐ応募できます。
            猫の手も借りたいほど忙しいあなたに、お得な情報をお届けしますにゃ🐾
          </p>
        </section>
      </div>
    </div>
  );
}
