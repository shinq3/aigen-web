import * as cheerio from 'cheerio';

const SCRAPE_TIMEOUT_MS = 10000;
const MIN_CONTENT_LENGTH = 300;

export async function scrapeArticleContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DauchyStudio/1.0; +https://dauchy.studio)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
    });
    clearTimeout(timer);

    if (!response.ok) {
      console.warn(`[ArticleScraper] HTTP ${response.status} for ${url}`);
      return '';
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, nav, header, footer, aside, .nav, .menu, .sidebar, .ad, .advertisement, .comment, .share, .social, iframe, noscript').remove();

    // Try common article selectors in priority order
    const selectors = [
      'article',
      '[class*="article-body"]',
      '[class*="article-content"]',
      '[class*="post-body"]',
      '[class*="post-content"]',
      '[class*="entry-content"]',
      '[class*="story-body"]',
      '[class*="content-body"]',
      'main',
      '.content',
      '#content',
    ];

    let bestHtml = '';
    let bestLength = 0;

    for (const selector of selectors) {
      const el = $(selector).first();
      if (el.length) {
        const text = el.text().trim();
        if (text.length > bestLength) {
          bestLength = text.length;
          bestHtml = el.html() || '';
        }
      }
    }

    if (bestLength < MIN_CONTENT_LENGTH) {
      // Fallback: collect all paragraphs from body
      const paragraphs: string[] = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) {
          paragraphs.push(`<p>${$(el).html()}</p>`);
        }
      });
      bestHtml = paragraphs.join('\n');
    }

    // Clean up scraped HTML: remove excessive whitespace, keep basic tags
    const cleaned = bestHtml
      .replace(/\s{3,}/g, ' ')
      .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>')
      .trim();

    console.log(`[ArticleScraper] Scraped ${cleaned.length} chars from ${url}`);
    return cleaned;
  } catch (err) {
    console.warn(`[ArticleScraper] Failed to scrape ${url}:`, err instanceof Error ? err.message : String(err));
    return '';
  }
}
