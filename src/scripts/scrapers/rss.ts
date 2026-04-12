/**
 * ソースA: RSSフィードから懸賞情報を取得
 * - 懸賞まとめサイトのRSSフィード
 * - robots.txt確認済みのオープンなフィード
 */
import * as cheerio from "cheerio";
import type { Kensho } from "../../lib/types";
import {
  defaultDeadline,
  fetchHtml,
  generateId,
  inferCategory,
  sleep,
  todayStr,
} from "./utils";

// 公開されている懸賞関連RSSフィード
const RSS_FEEDS = [
  {
    url: "https://news.livedoor.com/topics/rss/kensho.xml",
    label: "livedoor懸賞",
  },
  {
    url: "https://promo.auone.au.com/contents/rss/promo.xml",
    label: "au懸賞",
  },
];

function parseRssItems(xml: string, label: string): Kensho[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const results: Kensho[] = [];
  let idx = 0;

  $("item").each((_, el) => {
    const title = $(el).find("title").first().text().trim();
    const link = $(el).find("link").first().text().trim();
    const description = $(el).find("description").first().text().trim();
    const pubDate = $(el).find("pubDate").first().text().trim();

    if (!title || !link) return;

    const cleanDesc = description.replace(/<[^>]*>/g, "").slice(0, 200);
    const category = inferCategory(title + " " + cleanDesc);

    let createdAt = todayStr();
    if (pubDate) {
      try {
        createdAt = new Date(pubDate).toISOString().slice(0, 10);
      } catch {
        // ignore
      }
    }

    results.push({
      id: generateId(`rss-${label}`, idx++),
      title,
      description: cleanDesc || title,
      category,
      deadline: defaultDeadline(),
      imageUrl: "",
      url: link,
      sponsor: label,
      prize: "詳細はリンク先を確認",
      entryMethod: "Web",
      createdAt,
    });
  });

  return results;
}

export async function scrapeRss(): Promise<Kensho[]> {
  const all: Kensho[] = [];

  for (const feed of RSS_FEEDS) {
    console.log(`  [RSS] フェッチ中: ${feed.label} (${feed.url})`);
    try {
      const xml = await fetchHtml(feed.url);
      const items = parseRssItems(xml, feed.label);
      console.log(`  [RSS] 取得件数: ${items.length}件 (${feed.label})`);
      all.push(...items);
    } catch (err) {
      console.warn(`  [RSS] スキップ (${feed.label}): ${(err as Error).message}`);
    }
    await sleep(1000);
  }

  return all;
}
