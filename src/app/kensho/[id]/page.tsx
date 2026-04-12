import { notFound } from "next/navigation";
import kenshoData from "@/data/kensho.json";
import type { Kensho } from "@/lib/types";
import { withAffiliate } from "@/lib/affiliate";
import { formatDeadline, daysUntilDeadline, isClosingSOon } from "@/lib/kensho";

const allKensho = kenshoData as Kensho[];

const METHOD_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  Twitter: { label: "X / Twitter", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  Web: { label: "Web", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  LINE: { label: "LINE", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
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
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Ad top */}
        <div
          className="ad-placeholder rounded-xl flex items-center justify-center text-sm mb-8"
          style={{ height: 80 }}
        >
          広告枠
        </div>

        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
            letterSpacing: "0.03em",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <a href="/" className="link-muted">ホーム</a>
          <span style={{ opacity: 0.4 }}>/</span>
          <span
            style={{
              color: "var(--text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "60vw",
            }}
          >
            {k.title}
          </span>
        </nav>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

          {/* Main article */}
          <article style={{ flex: 1, minWidth: 0 }}>
            <div className="glass-card" style={{ borderRadius: 18, overflow: "hidden" }}>

              {/* Category strip */}
              <div
                style={{
                  padding: "0.75rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(212,175,55,0.05)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {CATEGORY_ICON[k.category]} {k.category}
                </span>
                {method && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.75rem",
                      borderRadius: 999,
                      color: method.color,
                      background: method.bg,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {method.label}で応募
                  </span>
                )}
              </div>

              <div style={{ padding: "1.75rem 1.75rem 2rem" }}>

                {/* Title */}
                <h1
                  style={{
                    fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif",
                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                    letterSpacing: "0.02em",
                    marginBottom: "1.25rem",
                  }}
                >
                  {k.title}
                </h1>

                {/* Status badges */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.6rem",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    <span style={{ opacity: 0.6 }}>締切 </span>
                    {formatDeadline(k.deadline)}
                  </span>

                  {closing ? (
                    <span
                      className="badge-neon-pulse"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#fff",
                        background: "var(--red-neon)",
                        padding: "0.25rem 0.8rem",
                        borderRadius: 999,
                        letterSpacing: "0.05em",
                      }}
                    >
                      まもなく終了！
                    </span>
                  ) : days <= 7 ? (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#fb923c",
                        background: "rgba(251,146,60,0.12)",
                        border: "1px solid rgba(251,146,60,0.3)",
                        padding: "0.25rem 0.8rem",
                        borderRadius: 999,
                        letterSpacing: "0.04em",
                      }}
                    >
                      あと{days}日
                    </span>
                  ) : null}
                </div>

                {/* Prize box */}
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: 12,
                    background: "rgba(212,175,55,0.07)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.4rem",
                      opacity: 0.8,
                    }}
                  >
                    Prize
                  </p>
                  <p
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    🎁 {k.prize}
                  </p>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.6rem",
                    }}
                  >
                    Campaign Detail
                  </p>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      lineHeight: 2,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {k.description}
                  </p>
                </div>

                {/* Info grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginBottom: "1.75rem",
                  }}
                >
                  {[
                    { label: "主催者", value: k.sponsor },
                    { label: "応募方法", value: k.entryMethod },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text-muted)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "1rem 1.5rem",
                    borderRadius: 12,
                    fontSize: "1rem",
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                  }}
                >
                  応募ページへ →
                </a>
              </div>
            </div>

            {/* Ad article bottom */}
            <div
              className="ad-placeholder rounded-xl flex items-center justify-center text-sm mt-6"
              style={{ height: 80 }}
            >
              広告枠
            </div>
          </article>

          {/* Sidebar — hidden on mobile, shown on lg via inline approach */}
          {related.length > 0 && (
            <aside
              style={{
                width: 272,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
              className="hidden lg:flex"
            >
              {/* Ad sidebar */}
              <div
                className="ad-placeholder rounded-xl flex items-center justify-center text-sm"
                style={{ height: 240 }}
              >
                広告枠
              </div>

              {/* Related */}
              <div className="glass-card" style={{ borderRadius: 14, padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                    opacity: 0.85,
                  }}
                >
                  同カテゴリの懸賞
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {related.map((r) => (
                    <a key={r.id} href={`/kensho/${r.id}`} className="related-item">
                      <p
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          lineHeight: 1.5,
                          marginBottom: "0.3rem",
                        }}
                        className="line-clamp-2"
                      >
                        {r.title}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {formatDeadline(r.deadline)}まで
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Back link */}
        <div style={{ marginTop: "2rem" }}>
          <a href="/" className="link-back">← 懸賞一覧に戻る</a>
        </div>
      </div>
    </div>
  );
}
