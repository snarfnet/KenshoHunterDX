/**
 * ソースC: 懸賞まとめサイトのスクレイピング
 * - 懸賞情報専門サイトから一覧を取得
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

// 懸賞びより: 人気の懸賞まとめサイト（robots.txt許可エリア）
async function scrapeKenshoBiyori(): Promise<Kensho[]> {
  const url = "https://kensho-biyori.com/";
  console.log(`  [まとめ] フェッチ中: 懸賞びより (${url})`);

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const results: Kensho[] = [];
  let idx = 0;

  // 懸賞びよりの記事一覧セレクタ
  $("article, .entry, .post, .kensho-item, .campaign-item").each((_, el) => {
    const titleEl = $(el).find("h2 a, h3 a, .entry-title a, .post-title a").first();
    const title = titleEl.text().trim();
    const href = titleEl.attr("href") || "";
    const desc = $(el).find(".entry-content p, .post-content p, .excerpt, .description").first().text().trim();
    const imgSrc = $(el).find("img").first().attr("src") || "";

    if (!title || title.length < 5) return;

    const url = href.startsWith("http") ? href : `https://kensho-biyori.com${href}`;
    const category = inferCategory(title + " " + desc);

    // 締め切り日付をテキストから抽出
    const fullText = $(el).text();
    const deadlineMatch = fullText.match(/(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})/);
    let deadline = defaultDeadline();
    if (deadlineMatch) {
      const [, y, m, d] = deadlineMatch;
      const parsed = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      if (!isNaN(parsed.getTime()) && parsed > new Date()) {
        deadline = parsed.toISOString().slice(0, 10);
      }
    }

    results.push({
      id: generateId("biyori", idx++),
      title,
      description: desc || title,
      category,
      deadline,
      imageUrl: imgSrc,
      url,
      sponsor: "各スポンサー",
      prize: "詳細はリンク先を確認",
      entryMethod: "Web",
      createdAt: todayStr(),
    });
  });

  return results;
}

// 懸賞ガイド (kensho-guide.net)
async function scrapeKenshoGuide(): Promise<Kensho[]> {
  const url = "https://kensho-guide.net/";
  console.log(`  [まとめ] フェッチ中: 懸賞ガイド (${url})`);

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const results: Kensho[] = [];
  let idx = 0;

  $("article, .post, .entry, li.campaign").each((_, el) => {
    const titleEl = $(el).find("h2 a, h3 a, .title a, a.entry-title").first();
    const title = titleEl.text().trim();
    const href = titleEl.attr("href") || $(el).find("a").first().attr("href") || "";
    const desc = $(el).find("p, .excerpt").first().text().trim();
    const imgSrc = $(el).find("img").first().attr("src") || "";

    if (!title || title.length < 5) return;

    const pageUrl = href.startsWith("http") ? href : `https://kensho-guide.net${href}`;
    const category = inferCategory(title + " " + desc);

    const fullText = $(el).text();
    const deadlineMatch = fullText.match(/(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})/);
    let deadline = defaultDeadline();
    if (deadlineMatch) {
      const [, y, m, d] = deadlineMatch;
      const parsed = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      if (!isNaN(parsed.getTime()) && parsed > new Date()) {
        deadline = parsed.toISOString().slice(0, 10);
      }
    }

    results.push({
      id: generateId("guide", idx++),
      title,
      description: desc || title,
      category,
      deadline,
      imageUrl: imgSrc,
      url: pageUrl,
      sponsor: "各スポンサー",
      prize: "詳細はリンク先を確認",
      entryMethod: "Web",
      createdAt: todayStr(),
    });
  });

  return results;
}

// 懸賞なび (kensho-navi.net) のRSSフィード
async function scrapeKenshoNaviRss(): Promise<Kensho[]> {
  const url = "https://kensho-navi.net/feed/";
  console.log(`  [まとめ] フェッチ中: 懸賞なびRSS (${url})`);

  const xml = await fetchHtml(url);
  const $ = cheerio.load(xml, { xmlMode: true });
  const results: Kensho[] = [];
  let idx = 0;

  $("item").each((_, el) => {
    const title = $(el).find("title").first().text().trim();
    const link = $(el).find("link").first().text().trim();
    const description = $(el).find("description").first().text().trim();
    const pubDate = $(el).find("pubDate").first().text().trim();
    const enclosureUrl = $(el).find("enclosure").attr("url") || "";

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

    // タイトルから締め切り日を抽出
    const deadlineMatch = (title + cleanDesc).match(/(\d{4})[年\/\-](\d{1,2})[月\/\-](\d{1,2})/);
    let deadline = defaultDeadline();
    if (deadlineMatch) {
      const [, y, m, d] = deadlineMatch;
      const parsed = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      if (!isNaN(parsed.getTime()) && parsed > new Date()) {
        deadline = parsed.toISOString().slice(0, 10);
      }
    }

    results.push({
      id: generateId("navi", idx++),
      title,
      description: cleanDesc || title,
      category,
      deadline,
      imageUrl: enclosureUrl,
      url: link,
      sponsor: "各スポンサー",
      prize: "詳細はリンク先を確認",
      entryMethod: "Web",
      createdAt,
    });
  });

  return results;
}

// 懸賞のプチテンシさん RSS
async function scrapePuchitentinRss(): Promise<Kensho[]> {
  const url = "https://www.puchitenti.com/feed/";
  console.log(`  [まとめ] フェッチ中: プチテンシRSS (${url})`);

  const xml = await fetchHtml(url);
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
      id: generateId("puchitenti", idx++),
      title,
      description: cleanDesc || title,
      category,
      deadline: defaultDeadline(),
      imageUrl: "",
      url: link,
      sponsor: "各スポンサー",
      prize: "詳細はリンク先を確認",
      entryMethod: "Web",
      createdAt,
    });
  });

  return results;
}

export async function scrapeMatome(): Promise<Kensho[]> {
  const all: Kensho[] = [];

  const scrapers = [
    { name: "懸賞なびRSS", fn: scrapeKenshoNaviRss },
    { name: "プチテンシRSS", fn: scrapePuchitentinRss },
    { name: "懸賞びより", fn: scrapeKenshoBiyori },
    { name: "懸賞ガイド", fn: scrapeKenshoGuide },
  ];

  for (const s of scrapers) {
    try {
      const items = await s.fn();
      console.log(`  [まとめ] 取得件数: ${items.length}件 (${s.name})`);
      all.push(...items);
    } catch (err) {
      console.warn(`  [まとめ] スキップ (${s.name}): ${(err as Error).message}`);
    }
    await sleep(1000);
  }

  return all;
}
