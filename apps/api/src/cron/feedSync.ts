import Parser from 'rss-parser';
import { PrismaClient } from '@prisma/client';
import { CronJob } from 'cron';

const prisma = new PrismaClient();
const parser = new Parser();

// 📰 TIER 6: News Feed / RSS Ingestion
// Inspired by InternalToolKit-ops Feed module. Refreshes operational feeds continuously.
export async function syncFeeds() {
  console.log('[Cron] Syncing News Feeds...');
  
  const sources = await prisma.feedSource.findMany({ where: { isActive: true } });

  for (const source of sources) {
    try {
      if (source.type === 'RSS' || source.type === 'ATOM') {
        const feed = await parser.parseURL(source.url);
        
        for (const item of feed.items) {
          // Prevent duplicates by checking URL
          const exists = await prisma.feedItem.findFirst({ where: { url: item.link } });
          
          if (!exists && item.link) {
            await prisma.feedItem.create({
              data: {
                sourceId: source.id,
                title: item.title || 'Untitled',
                content: item.contentSnippet || item.content || '',
                url: item.link,
                publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
              }
            });
          }
        }
      }
    } catch (error) {
      console.error(`[Cron] Failed to sync feed source ${source.name}:`, error);
    }
  }
}

// Run every hour
export const feedCronJob = new CronJob('0 * * * *', syncFeeds);
