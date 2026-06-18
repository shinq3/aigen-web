import Parser from 'rss-parser';
import { storage } from '../storage';
import type { RssSource } from '@shared/schema';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  isoDate?: string;
  contentEncoded?: string;
  mediaContent?: any;
  mediaThumbnail?: any;
}

export async function pollRssFeed(source: RssSource): Promise<void> {
  try {
    console.log(`[RSS Poller] Polling feed: ${source.name} (${source.feedUrl})`);
    
    const feed = await parser.parseURL(source.feedUrl);
    
    if (!feed.items || feed.items.length === 0) {
      console.log(`[RSS Poller] No items found in feed: ${source.name}`);
      await storage.updateRssSource(source.id, {
        lastPolledAt: new Date(),
      });
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const item of feed.items) {
      try {
        const rssItem = item as RssItem;
        
        if (!rssItem.title || !rssItem.link) {
          console.log(`[RSS Poller] Skipping item without title or link in ${source.name}`);
          skippedCount++;
          continue;
        }

        const existingQueueItem = await storage.getRssImportQueueItemBySourceUrl(rssItem.link);
        
        if (existingQueueItem) {
          skippedCount++;
          continue;
        }

        const thumbnailUrl = extractThumbnailUrl(rssItem);
        const content = rssItem.contentEncoded || rssItem.content || rssItem.contentSnippet || '';
        const publishedAt = rssItem.isoDate || rssItem.pubDate;

        await storage.createRssImportQueueItem({
          sourceId: source.id,
          rawPayload: {
            title: rssItem.title,
            link: rssItem.link,
            content,
            contentSnippet: rssItem.contentSnippet || '',
            contentEncoded: rssItem.contentEncoded || '',
            description: (item as any).description || '',
            publishedAt,
            thumbnailUrl,
            feedTitle: feed.title,
            creator: rssItem.creator || feed.title,
          },
        });

        console.log(`[RSS Poller] Added to queue: ${rssItem.title}`);
        addedCount++;
      } catch (itemError) {
        console.error(`[RSS Poller] Error processing item in ${source.name}:`, {
          error: itemError instanceof Error ? itemError.message : String(itemError),
          item: item?.title || 'unknown',
        });
      }
    }

    await storage.updateRssSource(source.id, {
      lastPolledAt: new Date(),
    });

    console.log(`[RSS Poller] Completed ${source.name}: ${addedCount} added, ${skippedCount} skipped`);
  } catch (error) {
    console.error(`[RSS Poller] Failed to poll ${source.name}:`, {
      url: source.feedUrl,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    await storage.updateRssSource(source.id, {
      lastPolledAt: new Date(),
    });
  }
}

function extractThumbnailUrl(item: RssItem): string | null {
  if (item.mediaThumbnail?.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }

  if (item.mediaContent?.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }

  const content = item.contentEncoded || item.content || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return null;
}

export async function pollAllActiveRssFeeds(): Promise<void> {
  try {
    const sources = await storage.getAllRssSources();
    const activeSources = sources.filter(s => s.isActive);

    console.log(`Polling ${activeSources.length} active RSS feeds`);

    for (const source of activeSources) {
      const now = new Date();
      const lastPolled = source.lastPolledAt ? new Date(source.lastPolledAt) : null;
      
      if (!lastPolled) {
        await pollRssFeed(source);
        continue;
      }

      const minutesSinceLastPoll = (now.getTime() - lastPolled.getTime()) / (1000 * 60);
      
      if (minutesSinceLastPoll >= parseInt(source.pollingIntervalMinutes)) {
        await pollRssFeed(source);
      }
    }
  } catch (error) {
    console.error('Error polling RSS feeds:', error);
  }
}

let pollingInterval: NodeJS.Timeout | null = null;

export function startRssPolling(intervalMinutes: number = 5): void {
  if (pollingInterval) {
    console.log('RSS polling already running');
    return;
  }

  console.log(`Starting RSS polling every ${intervalMinutes} minutes`);
  
  pollAllActiveRssFeeds();
  
  pollingInterval = setInterval(() => {
    pollAllActiveRssFeeds();
  }, intervalMinutes * 60 * 1000);
}

export function stopRssPolling(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log('RSS polling stopped');
  }
}
