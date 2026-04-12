/**
 * ソースB: 企業公式キャンペーンページのスクレイピング
 * 30社以上の企業キャンペーンページから情報を収集
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

interface ScraperConfig {
  name: string;
  url: string;
  sponsor: string;
  selector: string;
  titleSelector: string;
  linkSelector: string;
  descSelector?: string;
  imgSelector?: string;
  baseUrl: string;
  linkFilter?: (href: string) => boolean;
}

const SCRAPERS: ScraperConfig[] = [
  // === コンビニ ===
  {
    name: "ローソン",
    url: "https://www.lawson.co.jp/campaign/",
    sponsor: "ローソン株式会社",
    selector: "article.campaign li",
    titleSelector: "p.ttl",
    linkSelector: "p.img a, a",
    descSelector: "p:not(.ttl):not(.img)",
    imgSelector: "img",
    baseUrl: "https://www.lawson.co.jp",
    linkFilter: (href) => href.includes("/campaign/") || href.includes("/lab/campaign/"),
  },
  {
    name: "セブンイレブン",
    url: "https://www.sej.co.jp/cmp/",
    sponsor: "株式会社セブン‐イレブン・ジャパン",
    selector: ".campaignList__item, .campaign-item, article, li, .item",
    titleSelector: "h3, .ttl, .title, h2, p.title",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.sej.co.jp",
  },
  {
    name: "ファミリーマート",
    url: "https://www.family.co.jp/campaign.html",
    sponsor: "株式会社ファミリーマート",
    selector: ".campaignList li, .campaign-item, .ly-mod-layout-clm article, li, .item",
    titleSelector: "h3, .ttl, .title, p.name, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.family.co.jp",
  },
  {
    name: "ミニストップ",
    url: "https://www.ministop.co.jp/campaign/",
    sponsor: "ミニストップ株式会社",
    selector: ".campaign-list li, article, .entry, li, .item",
    titleSelector: "h3, h2, .title, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.ministop.co.jp",
  },
  // === 食品・飲料 ===
  {
    name: "ハーゲンダッツ",
    url: "https://www.haagen-dazs.co.jp/campaign/",
    sponsor: "ハーゲンダッツ ジャパン株式会社",
    selector: ".campaignList, .campaignHero",
    titleSelector: ".campaignList_body p, .campaignHero_title span",
    linkSelector: "a",
    descSelector: ".campaignList_date span, .campaignHero_date span",
    imgSelector: "img",
    baseUrl: "https://www.haagen-dazs.co.jp",
  },
  {
    name: "サントリー",
    url: "https://www.suntory.co.jp/enjoy/campaign/",
    sponsor: "サントリーホールディングス株式会社",
    selector: ".campaign-list li, .entry, article, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.suntory.co.jp",
  },
  {
    name: "キリン",
    url: "https://www.kirin.co.jp/campaign/",
    sponsor: "キリンホールディングス株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.kirin.co.jp",
  },
  {
    name: "アサヒ飲料",
    url: "https://www.asahiinryo.co.jp/entertainment/campaign/",
    sponsor: "アサヒ飲料株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.asahiinryo.co.jp",
  },
  {
    name: "コカ・コーラ",
    url: "https://www.cocacola.co.jp/campaigns",
    sponsor: "日本コカ・コーラ株式会社",
    selector: ".campaign-card, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, h2, .card-title",
    linkSelector: "a",
    descSelector: "p, .desc, .card-text",
    imgSelector: "img",
    baseUrl: "https://www.cocacola.co.jp",
  },
  {
    name: "明治",
    url: "https://www.meiji.co.jp/campaign/",
    sponsor: "株式会社明治",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.meiji.co.jp",
  },
  {
    name: "グリコ",
    url: "https://www.glico.com/jp/campaign/",
    sponsor: "江崎グリコ株式会社",
    selector: ".campaign-list li, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.glico.com",
  },
  {
    name: "カルビー",
    url: "https://www.calbee.co.jp/campaign/",
    sponsor: "カルビー株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.calbee.co.jp",
  },
  {
    name: "ロッテ",
    url: "https://www.lotte.co.jp/entertainment/campaign/",
    sponsor: "株式会社ロッテ",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.lotte.co.jp",
  },
  {
    name: "森永製菓",
    url: "https://www.morinaga.co.jp/campaign/",
    sponsor: "森永製菓株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.morinaga.co.jp",
  },
  {
    name: "日清食品",
    url: "https://www.nissin.com/jp/news/",
    sponsor: "日清食品ホールディングス株式会社",
    selector: "article, .news-item, .entry, li.item",
    titleSelector: "h3, h2, .title, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.nissin.com",
  },
  {
    name: "UCC",
    url: "https://www.ucc.co.jp/campaign/index.html",
    sponsor: "UCC上島珈琲株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.ucc.co.jp",
  },
  {
    name: "ダイドー",
    url: "https://www.dydo.co.jp/campaign/",
    sponsor: "ダイドードリンコ株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.dydo.co.jp",
  },
  {
    name: "伊藤園",
    url: "https://www.itoen.co.jp/news/release/",
    sponsor: "株式会社伊藤園",
    selector: "article, .news-item, .entry, li.item, li",
    titleSelector: "h3, h2, .title, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.itoen.co.jp",
  },
  // === スーパー・ドラッグストア ===
  {
    name: "イオン",
    url: "https://www.aeon.com/aeonapp/campaign/",
    sponsor: "イオン株式会社",
    selector: ".campaign-list li, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.aeon.com",
  },
  {
    name: "マツモトキヨシ",
    url: "https://www.matsukiyo.co.jp/campaign/",
    sponsor: "株式会社マツキヨココカラ&カンパニー",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.matsukiyo.co.jp",
  },
  {
    name: "ドン・キホーテ",
    url: "https://www.donki.com/campaign/",
    sponsor: "株式会社ドン・キホーテ",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.donki.com",
  },
  // === 飲食チェーン ===
  {
    name: "マクドナルド",
    url: "https://www.mcdonalds.co.jp/campaign/",
    sponsor: "日本マクドナルド株式会社",
    selector: ".campaign-list li, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.mcdonalds.co.jp",
  },
  {
    name: "ケンタッキー",
    url: "https://www.kfc.co.jp/menu/campaign",
    sponsor: "日本KFCホールディングス株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.kfc.co.jp",
  },
  {
    name: "モスバーガー",
    url: "https://www.mos.jp/cp/",
    sponsor: "株式会社モスフードサービス",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.mos.jp",
  },
  {
    name: "吉野家",
    url: "https://www.yoshinoya.com/campaign/",
    sponsor: "株式会社吉野家",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.yoshinoya.com",
  },
  {
    name: "すき家",
    url: "https://www.sukiya.jp/campaign_info/",
    sponsor: "株式会社すき家",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.sukiya.jp",
  },
  {
    name: "CoCo壱番屋",
    url: "https://www.ichibanya.co.jp/cp/",
    sponsor: "株式会社壱番屋",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.ichibanya.co.jp",
  },
  {
    name: "スターバックス",
    url: "https://www.starbucks.co.jp/youkou/",
    sponsor: "スターバックスコーヒージャパン株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.starbucks.co.jp",
  },
  // === 家電・通信 ===
  {
    name: "ソニー",
    url: "https://www.sony.jp/campaign/",
    sponsor: "ソニーグループ株式会社",
    selector: ".campaign-list li, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.sony.jp",
  },
  {
    name: "パナソニック",
    url: "https://panasonic.jp/campaign/",
    sponsor: "パナソニック株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://panasonic.jp",
  },
  // === コスメ・日用品 ===
  {
    name: "花王",
    url: "https://member.kao.com/jp/kaoplaza/campaign/",
    sponsor: "花王株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://member.kao.com",
  },
  {
    name: "資生堂",
    url: "https://www.shiseido.co.jp/sw/onlinestore/campaign/index.html",
    sponsor: "株式会社資生堂",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.shiseido.co.jp",
  },
  {
    name: "コーセー",
    url: "https://maison.kose.co.jp/site/p/campaign_list.aspx",
    sponsor: "株式会社コーセー",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://maison.kose.co.jp",
  },
  {
    name: "DHC",
    url: "https://www.dhc.co.jp/campaign/",
    sponsor: "株式会社DHC",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.dhc.co.jp",
  },
  {
    name: "ライオン",
    url: "https://www.lion.co.jp/ja/campaign/",
    sponsor: "ライオン株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.lion.co.jp",
  },
  // === 旅行・交通 ===
  {
    name: "JTB",
    url: "https://www.jtb.co.jp/theme/campaign/",
    sponsor: "株式会社JTB",
    selector: ".campaign-list li, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.jtb.co.jp",
  },
  {
    name: "JAL",
    url: "https://www.jal.co.jp/jp/ja/campaign/",
    sponsor: "日本航空株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.jal.co.jp",
  },
  {
    name: "ANA",
    url: "https://www.ana.co.jp/ja/jp/mycampaign/",
    sponsor: "全日本空輸株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.ana.co.jp",
  },
  // === EC・サービス ===
  {
    name: "楽天",
    url: "https://point.rakuten.co.jp/campaign/",
    sponsor: "楽天グループ株式会社",
    selector: ".campaign-list li, article, .entry, .item, .card, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://point.rakuten.co.jp",
  },
  {
    name: "任天堂",
    url: "https://www.nintendo.co.jp/software/campaign/index.html",
    sponsor: "任天堂株式会社",
    selector: ".campaign-list li, article, .entry, .item, li",
    titleSelector: "h3, .title, .ttl, h2",
    linkSelector: "a",
    descSelector: "p, .desc",
    imgSelector: "img",
    baseUrl: "https://www.nintendo.co.jp",
  },
  // === コスメ・美容（追加） ===
  {
    name: "@cosme",
    url: "https://www.cosme.net/present",
    sponsor: "@cosme",
    selector: "article, .present-item, .entry, .item, .card, li",
    titleSelector: "h3, .title, h2, .ttl, .present-title",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.cosme.net",
  },
  {
    name: "SK-II",
    url: "https://www.sk-ii.jp/new-arrivals-campaigns",
    sponsor: "SK-II",
    selector: "article, .campaign-item, .entry, .item, .card, li",
    titleSelector: "h3, .title, h2, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.sk-ii.jp",
  },
  {
    name: "ファンケル",
    url: "https://www.fancl.co.jp/campaign/index.html",
    sponsor: "株式会社ファンケル",
    selector: "article, .campaign-item, .entry, .item, .card, li",
    titleSelector: "h3, .title, h2, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.fancl.co.jp",
  },
  {
    name: "オルビス",
    url: "https://www.orbis.co.jp/campaign/",
    sponsor: "オルビス株式会社",
    selector: "article, .campaign-item, .entry, .item, .card, li",
    titleSelector: "h3, .title, h2, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.orbis.co.jp",
  },
  {
    name: "ドクターシーラボ",
    url: "https://www.ci-labo.com/shop/campaign",
    sponsor: "ドクターシーラボ",
    selector: "article, .campaign-item, .entry, .item, .card, li",
    titleSelector: "h3, .title, h2, .ttl",
    linkSelector: "a",
    descSelector: "p, .desc, .text",
    imgSelector: "img",
    baseUrl: "https://www.ci-labo.com",
  },
];

async function scrapeGeneric(config: ScraperConfig): Promise<Kensho[]> {
  const html = await fetchHtml(config.url);
  const $ = cheerio.load(html);
  const results: Kensho[] = [];
  let idx = 0;
  const seenTitles = new Set<string>();

  $(config.selector).each((_, el) => {
    const titleEl = $(el).find(config.titleSelector).first();
    const title = titleEl.text().trim();

    const linkEl = $(el).find(config.linkSelector).first();
    const href = linkEl.attr("href") || "";

    const desc = config.descSelector
      ? $(el).find(config.descSelector).first().text().trim()
      : "";

    const imgSrc = config.imgSelector
      ? $(el).find(config.imgSelector).first().attr("src") || ""
      : "";

    if (!title || title.length < 3) return;
    if (seenTitles.has(title)) return;
    seenTitles.add(title);

    if (config.linkFilter && href && !config.linkFilter(href)) return;

    const pageUrl = href
      ? href.startsWith("http")
        ? href
        : `${config.baseUrl}${href.startsWith("/") ? "" : "/"}${href}`
      : config.url;

    const imageUrl = imgSrc
      ? imgSrc.startsWith("http")
        ? imgSrc
        : imgSrc.startsWith("//")
        ? `https:${imgSrc}`
        : `${config.baseUrl}${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`
      : "";

    // 日付抽出
    const fullText = $(el).text();
    const deadlineMatch = fullText.match(
      /(\d{4})[年\/\-.](\d{1,2})[月\/\-.](\d{1,2})/
    );
    let deadline = defaultDeadline();
    if (deadlineMatch) {
      const [, y, m, d] = deadlineMatch;
      const parsed = new Date(
        `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
      );
      if (!isNaN(parsed.getTime()) && parsed > new Date()) {
        deadline = parsed.toISOString().slice(0, 10);
      }
    }

    results.push({
      id: generateId(config.name, idx++),
      title: title.startsWith("【") ? title : `【${config.name}】${title}`,
      description: desc || title,
      category: inferCategory(title + " " + desc + " " + config.name, config.sponsor),
      deadline,
      imageUrl,
      url: pageUrl,
      sponsor: config.sponsor,
      prize: "詳細はリンク先を確認",
      entryMethod: "Web",
      createdAt: todayStr(),
    });
  });

  return results;
}

export async function scrapeCampaigns(): Promise<Kensho[]> {
  const all: Kensho[] = [];

  for (const config of SCRAPERS) {
    console.log(`  [企業] フェッチ中: ${config.name} (${config.url})`);
    try {
      const items = await scrapeGeneric(config);
      console.log(`  [企業] 取得件数: ${items.length}件 (${config.name})`);
      all.push(...items);
    } catch (err) {
      console.warn(
        `  [企業] スキップ (${config.name}): ${(err as Error).message}`
      );
    }
    await sleep(1500);
  }

  return all;
}
