import type { Category } from "../../lib/types";

export const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "ja,en;q=0.9",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function defaultDeadline(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// 企業名からデフォルトカテゴリを推測
const SPONSOR_CATEGORY: Record<string, Category> = {
  ローソン: "食品",
  セブンイレブン: "食品",
  ファミリーマート: "食品",
  ミニストップ: "食品",
  ハーゲンダッツ: "食品",
  サントリー: "食品",
  キリン: "食品",
  アサヒ: "食品",
  "コカ・コーラ": "食品",
  明治: "食品",
  グリコ: "食品",
  カルビー: "食品",
  ロッテ: "食品",
  森永: "食品",
  日清: "食品",
  UCC: "食品",
  ダイドー: "食品",
  伊藤園: "食品",
  ヤクルト: "食品",
  マクドナルド: "食品",
  ケンタッキー: "食品",
  モスバーガー: "食品",
  吉野家: "食品",
  すき家: "食品",
  CoCo壱番屋: "食品",
  スターバックス: "食品",
  ソニー: "家電",
  パナソニック: "家電",
  花王: "コスメ",
  資生堂: "コスメ",
  コーセー: "コスメ",
  DHC: "コスメ",
  ライオン: "その他",
  イオン: "その他",
  マツモトキヨシ: "その他",
  "ドン・キホーテ": "その他",
  JTB: "旅行",
  JAL: "旅行",
  ANA: "旅行",
  楽天: "ギフト券",
  任天堂: "ゲーム",
  "@cosme": "コスメ",
  "SK-II": "コスメ",
  ファンケル: "コスメ",
  オルビス: "コスメ",
  ドクターシーラボ: "コスメ",
};

export function inferCategory(text: string, sponsorName?: string): Category {
  const t = text.toLowerCase();

  // キーワードによる判定（優先）
  if (/食品|飲料|食べ|お菓子|グルメ|米|水|ジュース|コーヒー|お茶|ビール|ワイン|チョコ|アイス|甘酒|牛乳|乳製品|カップ麺|ラーメン|弁当|おにぎり|パン|ケーキ|スイーツ|デザート|フード|ドリンク|缶|ペット|飲み物|菓子|スナック|プリン|ヨーグルト|サラダ|惣菜|冷凍|レトルト|調味料|ソース/.test(t))
    return "食品";
  if (/家電|テレビ|スマホ|iphone|android|pc|パソコン|冷蔵庫|洗濯機|掃除機|エアコン|カメラ|ヘッドホン|イヤホン|タブレット|モニター|プリンター/.test(t))
    return "家電";
  if (/コスメ|化粧|スキンケア|美容|香水|シャンプー|美容液|クリーム|ファンデ|リップ|洗顔|ボディ|ハンドクリーム|日焼け|UV|メイク|ネイル|ヘアケア|歯磨き|歯ブラシ|ハブラシ|洗剤|柔軟/.test(t))
    return "コスメ";
  if (/旅行|ホテル|温泉|宿泊|トラベル|航空|飛行機|リゾート|マイル|フライト|搭乗|空港|ツアー|観光/.test(t))
    return "旅行";
  if (/ギフト券|商品券|クーポン|ポイント|アマゾン|amazon|楽天|図書カード|quoカード|quo|プリペイド|nanaco|waon|paypay/.test(t))
    return "ギフト券";
  if (/ゲーム|nintendo|switch|ps5|プレステ|xbox|steam|プレイステーション|ニンテンドー|マリオ/.test(t))
    return "ゲーム";

  // 企業名からのフォールバック判定
  if (sponsorName) {
    for (const [key, cat] of Object.entries(SPONSOR_CATEGORY)) {
      if (sponsorName.includes(key) || text.includes(key)) return cat;
    }
  }

  // テキスト中の企業名でも判定
  for (const [key, cat] of Object.entries(SPONSOR_CATEGORY)) {
    if (text.includes(key)) return cat;
  }

  return "その他";
}

export async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

export function generateId(source: string, index: number): string {
  const base = `${source}-${Date.now()}-${index}`;
  return Buffer.from(base).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
}
