/**
 * KenshoHunterDX Phase 2 スクレイピングスクリプト
 * 実行: npm run scrape
 *
 * 取得元:
 *   A: RSSフィード (ライブドア懸賞など)
 *   B: 企業公式キャンペーンページ (ローソン、サントリー、ハーゲンダッツ)
 *   C: 懸賞まとめサイト (懸賞なびRSS、プチテンシRSS、懸賞びより、懸賞ガイド)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Kensho } from "../lib/types";
import { scrapeRss } from "./scrapers/rss";
import { scrapeCampaigns } from "./scrapers/campaigns";
import { scrapeMatome } from "./scrapers/matome";

const DATA_PATH = join(process.cwd(), "src/data/kensho.json");

function loadExisting(): Kensho[] {
  try {
    const raw = readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Kensho[];
  } catch {
    return [];
  }
}

function mergeData(existing: Kensho[], incoming: Kensho[]): Kensho[] {
  const existingUrls = new Set(existing.map((k) => k.url));
  const existingIds = new Set(existing.map((k) => k.id));

  const newItems = incoming.filter(
    (k) => k.title && k.url && !existingUrls.has(k.url) && !existingIds.has(k.id)
  );

  console.log(`\n既存データ: ${existing.length}件`);
  console.log(`新規取得: ${incoming.length}件`);
  console.log(`重複除外後の新規: ${newItems.length}件`);

  return [...existing, ...newItems];
}

async function main() {
  console.log("=== KenshoHunterDX スクレイピング開始 ===\n");

  const existing = loadExisting();
  const allNew: Kensho[] = [];

  // ソースA: RSSフィード
  console.log("[ソースA] RSSフィードからスクレイピング...");
  try {
    const rssItems = await scrapeRss();
    allNew.push(...rssItems);
  } catch (err) {
    console.error("[ソースA] エラー:", (err as Error).message);
  }

  // ソースB: 企業公式キャンペーンページ
  console.log("\n[ソースB] 企業公式キャンペーンページからスクレイピング...");
  try {
    const campaignItems = await scrapeCampaigns();
    allNew.push(...campaignItems);
  } catch (err) {
    console.error("[ソースB] エラー:", (err as Error).message);
  }

  // ソースC: 懸賞まとめサイト
  console.log("\n[ソースC] 懸賞まとめサイトからスクレイピング...");
  try {
    const matomeItems = await scrapeMatome();
    allNew.push(...matomeItems);
  } catch (err) {
    console.error("[ソースC] エラー:", (err as Error).message);
  }

  // マージして保存
  const merged = mergeData(existing, allNew);
  writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2), "utf-8");

  console.log(`\n=== 完了: ${merged.length}件を ${DATA_PATH} に保存しました ===`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
