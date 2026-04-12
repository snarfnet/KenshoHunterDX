import { notFound } from "next/navigation";
import kenshoData from "@/data/kensho.json";
import type { Kensho } from "@/lib/types";
import { withAffiliate } from "@/lib/affiliate";
import { formatDeadline, daysUntilDeadline, isClosingSOon } from "@/lib/kensho";

const allKensho = kenshoData as Kensho[];

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

export function generateStaticParams() {
  return allKensho.map((k) => ({ id: k.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const k = allKensho.find((item) => item.id === id);
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
  const method = METHOD_LABELS[k.entryMethod];

  const related = allKensho
    .filter((item) => item.id !== k.id && item.category === k.category)
    .slice(0, 3);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Ad top */}
        <div className="ad-placeholder flex items-center justify-center text-sm mb-8" style={{ height: 80 }}>
          広告枠
        </div>

        {/* Breadcrumb */}
        <nav style={{ fontSize: "0.78rem", color: "#b0a4a4", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <a href="/" style={{ color: "#7a6e6e", textDecoration: "none" }}>🐱 ホーム</a>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "#7a6e6e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60vw" }}>
            {k.title}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main article */}
          <article style={{ flex: 1, minWidth: 0 }}>
            <div className="cute-card" style={{ overflow: "hidden" }}>
              {/* Category strip */}
              <div
                style={{
                  padding: "0.7rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f5ede3",
                  background: "#fdf8f2",
                }}
              >
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e8739a" }}>
                  {CATEGORY_ICON[k.category]} {k.category}
                </span>
                {method && (
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.75rem",
                      borderRadius: 999,
                      color: method.color,
                      background: method.bg,
                    }}
                  >
                    {method.label}で応募
                  </span>
                )}
              </div>

              <div style={{ padding: "1.5rem 1.5rem 1.75rem" }}>
                {/* Title */}
                <h1
                  style={{
                    fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
                    fontWeight: 700,
                    color: "#3a3030",
                    lineHeight: 1.55,
                    marginBottom: "1rem",
                  }}
                >
                  {k.title}
                </h1>

                {/* Status */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#7a6e6e" }}>
                    📅 締切: {formatDeadline(k.deadline)}
                  </span>
                  {closing ? (
                    <span
                      className="badge-pulse"
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        color: "#ef5350",
                        background: "#ffebee",
                        padding: "0.25rem 0.75rem",
                        borderRadius: 999,
                        border: "1px solid #ffcdd2",
                      }}
                    >
                      🔥 まもなく終了！
                    </span>
                  ) : days <= 7 ? (
                    <span
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        color: "#f57c00",
                        background: "#fff3e0",
                        padding: "0.25rem 0.75rem",
                        borderRadius: 999,
                        border: "1px solid #ffe0b2",
                      }}
                    >
                      あと{days}日
                    </span>
                  ) : null}
                </div>

                {/* Prize */}
                <div
                  style={{
                    padding: "0.9rem 1.1rem",
                    borderRadius: 14,
                    background: "#fff8f0",
                    border: "1.5px solid #f5e0c0",
                    marginBottom: "1.25rem",
                  }}
                >
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e8739a", marginBottom: "0.3rem" }}>
                    🎁 賞品
                  </p>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "#3a3030" }}>
                    {k.prize}
                  </p>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#b0a4a4", marginBottom: "0.5rem" }}>
                    📝 キャンペーン詳細
                  </p>
                  <p style={{ fontSize: "0.88rem", color: "#7a6e6e", lineHeight: 2 }}>
                    {k.description}
                  </p>
                </div>

                {/* Info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {[
                    { label: "主催者", value: k.sponsor },
                    { label: "応募方法", value: k.entryMethod },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        padding: "0.7rem 0.9rem",
                        borderRadius: 12,
                        background: "#faf6f0",
                        border: "1px solid #f0e6d8",
                      }}
                    >
                      <p style={{ fontSize: "0.7rem", color: "#b0a4a4", marginBottom: "0.25rem" }}>{label}</p>
                      <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#3a3030" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "1rem 1.5rem",
                    fontSize: "1rem",
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                  }}
                >
                  🐾 応募ページへ
                </a>
              </div>
            </div>

            {/* Ad bottom */}
            <div className="ad-placeholder flex items-center justify-center text-sm mt-6" style={{ height: 80 }}>
              広告枠
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 flex flex-col gap-5">
            {/* Ad sidebar */}
            <div className="ad-placeholder flex items-center justify-center text-sm" style={{ height: 240 }}>
              広告枠
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="cute-card" style={{ padding: "1.1rem" }}>
                <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e8739a", marginBottom: "0.75rem" }}>
                  🐱 同じカテゴリの懸賞
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {related.map((r) => (
                    <a
                      key={r.id}
                      href={`/kensho/${r.id}`}
                      style={{
                        display: "block",
                        padding: "0.7rem 0.8rem",
                        borderRadius: 12,
                        background: "#faf6f0",
                        border: "1px solid #f0e6d8",
                        textDecoration: "none",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                    >
                      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#3a3030", lineHeight: 1.5, marginBottom: "0.2rem" }} className="line-clamp-2">
                        {r.title}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#b0a4a4" }}>
                        📅 {formatDeadline(r.deadline)}まで
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Back */}
        <div style={{ marginTop: "1.5rem" }}>
          <a href="/" style={{ fontSize: "0.82rem", color: "#e8739a", textDecoration: "none", fontWeight: 600 }}>
            ← 懸賞一覧に戻るにゃ🐾
          </a>
        </div>
      </div>
    </div>
  );
}
