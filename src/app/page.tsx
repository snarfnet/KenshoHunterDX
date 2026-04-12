"use client";

import { useState, useMemo, useEffect } from "react";
import kenshoData from "@/data/kensho.json";
import type { Kensho, Category } from "@/lib/types";
import { ALL_CATEGORIES } from "@/lib/types";
import { withAffiliate } from "@/lib/affiliate";
import { daysUntilDeadline, isClosingSOon, formatDeadline } from "@/lib/kensho";

type SortMode = "deadline" | "newest";

const METHOD_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  Twitter: {
    label: "X / Twitter",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
  },
  Web: {
    label: "Web",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
  },
  LINE: {
    label: "LINE",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
  },
};

const CATEGORY_ICON: Record<string, string> = {
  食品: "🍽",
  家電: "📺",
  コスメ: "💄",
  旅行: "✈",
  ギフト券: "🎫",
  ゲーム: "🎮",
  その他: "◈",
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("deadline");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allData = kenshoData as Kensho[];

  const filtered = useMemo(() => {
    // Filter expired
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let list = allData.filter((k) => {
      const deadline = new Date(k.deadline);
      deadline.setHours(23, 59, 59, 999);
      return deadline >= today;
    });

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter((k) => k.category === selectedCategory);
    }

    // Sort
    list = [...list].sort((a, b) => {
      if (sortMode === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [allData, selectedCategory, sortMode, mounted]);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Ad placeholder top */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div
          className="ad-placeholder rounded-xl flex items-center justify-center text-sm mb-8"
          style={{ height: 80 }}
        >
          広告枠
        </div>
      </div>

      {/* Hero */}
      <div
        className="hero-scanline"
        style={{
          paddingTop: "3rem",
          paddingBottom: "3.5rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Ambient glow behind hero */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6" style={{ position: "relative" }}>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
              opacity: 0.8,
            }}
          >
            Daily Updated
          </p>
          <h2
            style={{
              fontFamily:
                "'Hiragino Mincho ProN', 'Yu Mincho', 'Georgia', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "0.03em",
              lineHeight: 1.3,
              marginBottom: "1rem",
            }}
          >
            お得な懸賞情報を、毎日更新。
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
            }}
          >
            Twitter・Web・LINEの最新キャンペーンをまとめてチェック
          </p>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        {/* Category pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <button
            onClick={() => setSelectedCategory("all")}
            className={
              selectedCategory === "all" ? "filter-pill-active" : "filter-pill"
            }
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 999,
              fontSize: "0.8rem",
              cursor: "pointer",
              fontWeight: selectedCategory === "all" ? 600 : 400,
              letterSpacing: "0.03em",
            }}
          >
            すべて
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                selectedCategory === cat ? "filter-pill-active" : "filter-pill"
              }
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 999,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: selectedCategory === cat ? 600 : 400,
                letterSpacing: "0.03em",
              }}
            >
              {CATEGORY_ICON[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Sort + count row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              letterSpacing: "0.03em",
            }}
          >
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            件の懸賞
          </p>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={() => setSortMode("deadline")}
              className={sortMode === "deadline" ? "sort-btn-active" : "sort-btn"}
              style={{
                padding: "0.3rem 0.9rem",
                borderRadius: 6,
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              締切が近い順
            </button>
            <button
              onClick={() => setSortMode("newest")}
              className={sortMode === "newest" ? "sort-btn-active" : "sort-btn"}
              style={{
                padding: "0.3rem 0.9rem",
                borderRadius: 6,
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              新着順
            </button>
          </div>
        </div>

        {/* Card grid */}
        {!mounted ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
            読み込み中...
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
                className="glass-card"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {/* Card top strip */}
                <div
                  style={{
                    padding: "0.65rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--gold)",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {CATEGORY_ICON[k.category]} {k.category}
                  </span>
                  {method && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.65rem",
                        borderRadius: 999,
                        color: method.color,
                        background: method.bg,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {method.label}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: "1rem 1.1rem 1.1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily:
                        "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      letterSpacing: "0.02em",
                    }}
                    className="line-clamp-2"
                  >
                    {k.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                    className="line-clamp-2"
                  >
                    {k.description}
                  </p>

                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    提供: {k.sponsor}
                  </div>

                  {/* Prize */}
                  <div
                    style={{
                      padding: "0.5rem 0.85rem",
                      borderRadius: 8,
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.18)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--gold-bright)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    🎁 {k.prize}
                  </div>

                  {/* Footer row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDeadline(k.deadline)}まで
                    </span>

                    {closing ? (
                      <span
                        className="badge-neon-pulse"
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#fff",
                          background: "var(--red-neon)",
                          padding: "0.2rem 0.65rem",
                          borderRadius: 999,
                          letterSpacing: "0.04em",
                        }}
                      >
                        まもなく終了
                      </span>
                    ) : days <= 7 ? (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#fb923c",
                          background: "rgba(251,146,60,0.12)",
                          border: "1px solid rgba(251,146,60,0.3)",
                          padding: "0.2rem 0.65rem",
                          borderRadius: 999,
                          letterSpacing: "0.04em",
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
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>◈</p>
            <p style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>
              該当する懸賞が見つかりませんでした
            </p>
          </div>
        )}

        {/* Ad placeholder bottom */}
        <div
          className="ad-placeholder rounded-xl flex items-center justify-center text-sm mt-10"
          style={{ height: 80 }}
        >
          広告枠
        </div>

        {/* About */}
        <section
          id="about"
          className="glass-card"
          style={{
            marginTop: "3rem",
            marginBottom: "2rem",
            borderRadius: 16,
            padding: "2rem 2.5rem",
          }}
        >
          <h2
            style={{
              fontFamily:
                "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "0.04em",
              marginBottom: "1rem",
            }}
          >
            懸賞ハンターDXについて
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 2,
              letterSpacing: "0.02em",
            }}
          >
            懸賞ハンターDXは、Twitter・Web・LINEなどの最新懸賞・プレゼントキャンペーン情報を
            まとめてお届けする情報サイトです。毎日更新される懸賞情報の中から、カテゴリや締切で
            簡単に絞り込んで、気になるキャンペーンにすぐ応募できます。
          </p>
        </section>
      </div>
    </div>
  );
}
