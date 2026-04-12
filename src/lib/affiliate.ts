const AMAZON_AFFILIATE_ID = "kixyouhueizou-22";

/**
 * AmazonのURLにアフィリエイトIDを付与する
 */
export function addAmazonAffiliate(url: string): string {
  if (!isAmazonUrl(url)) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("tag", AMAZON_AFFILIATE_ID);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function isAmazonUrl(url: string): boolean {
  return /amazon\.co\.jp|amazon\.com/.test(url);
}

/**
 * 懸賞のURLにアフィリエイトIDを付与する（Amazon対応）
 */
export function withAffiliate(url: string): string {
  return addAmazonAffiliate(url);
}
