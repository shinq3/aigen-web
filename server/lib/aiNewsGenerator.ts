import { storage } from '../storage.js';
import { translateWithGPT4, generateSummaryWithGPT4, generateImageWithDallE } from './openaiClient.js';
import { downloadAndUploadImage } from './imageUploader.js';
import { stripBase64Images, restoreBase64Images, estimateTokenCount } from './htmlUtils.js';
import { scrapeArticleContent } from './articleScraper.js';
import type { RssImportQueue, InsertNews, InsertNewsTranslation, InsertAiGenerationJob } from '@shared/schema';

const SHORT_CONTENT_THRESHOLD = 500; // chars; scrape if RSS content shorter than this

export interface GenerateNewsFromQueueOptions {
  queueItemId: string;
  adminId: string;
  generateImage?: boolean;
  targetLanguages?: ('ja' | 'en' | 'vi')[];
}

export interface GenerateNewsResult {
  success: boolean;
  newsId?: string;
  jobIds: string[];
  error?: string;
}

function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  if (!baseSlug || baseSlug.length < 3) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `article-${timestamp}-${randomId}`;
  }
  
  return baseSlug;
}

export async function generateNewsFromQueue(options: GenerateNewsFromQueueOptions): Promise<GenerateNewsResult> {
  const { queueItemId, adminId, generateImage = false, targetLanguages = ['ja', 'en', 'vi'] } = options;

  try {
    const queueItem = await storage.getRssImportQueueItem(queueItemId);
    if (!queueItem) {
      return { success: false, jobIds: [], error: 'Queue item not found' };
    }

    if (queueItem.processingState !== 'pending') {
      return { success: false, jobIds: [], error: `Queue item is already ${queueItem.processingState}` };
    }

    const rssSource = await storage.getRssSource(queueItem.sourceId);
    if (!rssSource) {
      return { success: false, jobIds: [], error: 'RSS source not found' };
    }

    const payload = queueItem.rawPayload as any;
    const sourceLanguage = rssSource.language;
    const sourceTitle = payload.title || 'Untitled';
    const sourceExcerpt = payload.contentSnippet || payload.description || '';
    let sourceContent = payload.contentEncoded || payload.content || payload.description || sourceExcerpt;

    console.log(`[AI News Generator] Generating news from queue item: ${queueItemId}`);
    console.log(`[AI News Generator] Source language: ${sourceLanguage}, Target languages: ${targetLanguages.join(', ')}`);
    console.log(`[AI News Generator] Content length: ${sourceContent.length} chars`);

    // If RSS content is too short, try to scrape full article from source URL
    if (sourceContent.length < SHORT_CONTENT_THRESHOLD && payload.link) {
      console.log(`[AI News Generator] Content too short (${sourceContent.length} chars), scraping from ${payload.link}`);
      const scraped = await scrapeArticleContent(payload.link);
      if (scraped.length > sourceContent.length) {
        sourceContent = scraped;
        console.log(`[AI News Generator] Scraped content: ${scraped.length} chars`);
      }
    }

    const slug = generateSlug(sourceTitle);
    
    const newsData: InsertNews = {
      title: sourceTitle,
      slug,
      excerpt: sourceExcerpt.substring(0, 300),
      content: sourceContent,
      category: rssSource.category || 'AI',
      tags: ['AI', 'RSS', rssSource.name],
      featuredImage: payload.thumbnailUrl || null,
      isExternal: false, // AI-generated news is internal content
      sourceUrl: payload.link || payload.guid,
      sourceAttribution: payload.feedTitle || payload.creator || rssSource.name,
      originalPublishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
      status: 'draft',
      authorId: adminId,
    };

    const news = await storage.createNews(newsData);
    console.log(`[AI News Generator] Created news: ${news.id}`);

    const jobIds: string[] = [];
    let firstLanguageSummary = '';

    for (const targetLang of targetLanguages) {
      let translatedTitle = sourceTitle;
      let translatedExcerpt = sourceExcerpt;
      let translatedContent = sourceContent;
      let aiSummary = '';

      if (targetLang !== sourceLanguage) {
        console.log(`[AI News Generator] Translating to ${targetLang}...`);

        const titleJob = await storage.createAiGenerationJob({
          newsId: news.id,
          jobType: 'translation',
          provider: 'openai',
          status: 'processing',
          inputPayload: { type: 'title', sourceLanguage, targetLanguage: targetLang, text: sourceTitle },
        });
        jobIds.push(titleJob.id);

        try {
          const titleResult = await translateWithGPT4({
            sourceText: sourceTitle,
            sourceLanguage,
            targetLanguage: targetLang,
            contentType: 'title',
          });
          translatedTitle = titleResult.translatedText;
          await storage.updateAiGenerationJob(titleJob.id, {
            status: 'completed',
            resultJson: titleResult,
          });
          console.log(`[AI News Generator] Title translated to ${targetLang}: ${translatedTitle.substring(0, 50)}...`);
        } catch (error: any) {
          await storage.updateAiGenerationJob(titleJob.id, {
            status: 'failed',
            errorMessage: error.message,
          });
          console.error(`[AI News Generator] Title translation failed:`, error.message);
        }

        const excerptJob = await storage.createAiGenerationJob({
          newsId: news.id,
          jobType: 'translation',
          provider: 'openai',
          status: 'processing',
          inputPayload: { type: 'excerpt', sourceLanguage, targetLanguage: targetLang, text: sourceExcerpt },
        });
        jobIds.push(excerptJob.id);

        try {
          const excerptResult = await translateWithGPT4({
            sourceText: sourceExcerpt,
            sourceLanguage,
            targetLanguage: targetLang,
            contentType: 'excerpt',
          });
          translatedExcerpt = excerptResult.translatedText;
          await storage.updateAiGenerationJob(excerptJob.id, {
            status: 'completed',
            resultJson: excerptResult,
          });
        } catch (error: any) {
          await storage.updateAiGenerationJob(excerptJob.id, {
            status: 'failed',
            errorMessage: error.message,
          });
          console.error(`[AI News Generator] Excerpt translation failed:`, error.message);
        }

        const contentJob = await storage.createAiGenerationJob({
          newsId: news.id,
          jobType: 'translation',
          provider: 'openai',
          status: 'processing',
          inputPayload: { type: 'content', sourceLanguage, targetLanguage: targetLang, text: sourceContent },
        });
        jobIds.push(contentJob.id);

        try {
          // Strip base64 images before translation to reduce token count
          const { sanitizedHtml, imageMappings } = stripBase64Images(sourceContent);
          const estimatedTokens = estimateTokenCount(sanitizedHtml);
          console.log(`[AI News Generator] Content translation - Estimated tokens: ${estimatedTokens}`);
          
          const contentResult = await translateWithGPT4({
            sourceText: sanitizedHtml,
            sourceLanguage,
            targetLanguage: targetLang,
            contentType: 'content',
          });
          
          // Restore base64 images to translated content
          translatedContent = restoreBase64Images(contentResult.translatedText, imageMappings);
          
          await storage.updateAiGenerationJob(contentJob.id, {
            status: 'completed',
            resultJson: contentResult,
          });
        } catch (error: any) {
          await storage.updateAiGenerationJob(contentJob.id, {
            status: 'failed',
            errorMessage: error.message,
          });
          console.error(`[AI News Generator] Content translation failed:`, error.message);
        }
      } else {
        console.log(`[AI News Generator] Using source language content for ${targetLang}`);
      }

      const summaryJob = await storage.createAiGenerationJob({
        newsId: news.id,
        jobType: 'content_summary',
        provider: 'openai',
        status: 'processing',
        inputPayload: { language: targetLang, text: translatedContent },
      });
      jobIds.push(summaryJob.id);

      try {
        // Strip base64 images from content before generating summary
        const { sanitizedHtml } = stripBase64Images(translatedContent);
        
        const summaryResult = await generateSummaryWithGPT4({
          content: sanitizedHtml,
          language: targetLang,
          maxLength: 200,
        });
        aiSummary = summaryResult.summary;
        
        // Save first language summary to update news excerpt
        if (targetLang === targetLanguages[0]) {
          firstLanguageSummary = aiSummary;
        }
        
        await storage.updateAiGenerationJob(summaryJob.id, {
          status: 'completed',
          resultJson: summaryResult,
        });
        console.log(`[AI News Generator] Summary generated for ${targetLang}`);
      } catch (error: any) {
        await storage.updateAiGenerationJob(summaryJob.id, {
          status: 'failed',
          errorMessage: error.message,
        });
        console.error(`[AI News Generator] Summary generation failed:`, error.message);
      }

      const translationData: InsertNewsTranslation = {
        newsId: news.id,
        locale: targetLang,
        title: translatedTitle,
        excerpt: translatedExcerpt.substring(0, 300),
        content: translatedContent,
        seoTitle: translatedTitle,
        seoDescription: translatedExcerpt.substring(0, 160),
        aiSummary,
      };

      await storage.upsertNewsTranslation(translationData);
      console.log(`[AI News Generator] Translation upserted for ${targetLang}`);
    }

    // Update news excerpt with first language AI summary if original excerpt is empty
    if (firstLanguageSummary && (!sourceExcerpt || sourceExcerpt.trim().length === 0)) {
      await storage.updateNews(news.id, {
        excerpt: firstLanguageSummary.substring(0, 300),
      });
      console.log(`[AI News Generator] Updated news excerpt with AI summary`);
    }

    if (generateImage) {
      console.log(`[AI News Generator] Generating featured image...`);
      const imageJob = await storage.createAiGenerationJob({
        newsId: news.id,
        jobType: 'image_generation',
        provider: 'openai',
        status: 'processing',
        inputPayload: { prompt: `Professional news article illustration for: ${sourceTitle}` },
      });
      jobIds.push(imageJob.id);

      try {
        const imageResult = await generateImageWithDallE({
          prompt: `Professional, modern news article hero image for an article about: ${sourceTitle}. Clean, minimalist style suitable for a technology blog.`,
          style: 'natural',
          quality: 'standard',
          size: '1792x1024',
        });
        
        console.log(`[AI News Generator] DALL-E image generated, downloading and uploading to storage...`);
        
        // Download DALL-E image and upload to Object Storage for persistence
        const uploadResult = await downloadAndUploadImage(
          imageResult.imageUrl,
          `news-${news.id}-${Date.now()}.png`
        );
        
        await storage.updateNews(news.id, {
          featuredImage: uploadResult.objectPath,
        });

        await storage.updateAiGenerationJob(imageJob.id, {
          status: 'completed',
          resultJson: { 
            ...imageResult, 
            persistentUrl: uploadResult.objectPath,
            publicUrl: uploadResult.publicUrl,
          },
        });
        console.log(`[AI News Generator] Image saved to storage: ${uploadResult.objectPath}`);
      } catch (error: any) {
        await storage.updateAiGenerationJob(imageJob.id, {
          status: 'failed',
          errorMessage: error.message,
        });
        console.error(`[AI News Generator] Image generation/upload failed:`, error.message);
      }
    }

    await storage.updateRssImportQueueItem(queueItemId, {
      processingState: 'approved',
      newsId: news.id,
      processedByAdminId: adminId,
    });

    console.log(`[AI News Generator] ✅ Successfully generated news: ${news.id} with ${jobIds.length} AI jobs`);

    return {
      success: true,
      newsId: news.id,
      jobIds,
    };
  } catch (error: any) {
    console.error(`[AI News Generator] Failed to generate news:`, error);
    return {
      success: false,
      jobIds: [],
      error: error.message,
    };
  }
}

export interface GenerateContentForExistingNewsOptions {
  newsId: string;
  generateImage?: boolean;
  targetLanguages?: ('ja' | 'en' | 'vi')[];
}

export async function generateContentForExistingNews(options: GenerateContentForExistingNewsOptions): Promise<GenerateNewsResult> {
  const { newsId, generateImage = false, targetLanguages = ['ja', 'en', 'vi'] } = options;

  try {
    const news = await storage.getNews(newsId);
    if (!news) {
      return { success: false, jobIds: [], error: 'News not found' };
    }

    console.log(`[AI News Generator] Generating content for existing news: ${newsId}`);
    
    // Prefer JA translation as source content (most reliable for Japanese articles)
    // Fall back to main news fields if no JA translation exists
    const jaTranslation = await storage.getNewsTranslation(newsId, 'ja');

    const sourceTitle = jaTranslation?.title || news.title || 'Untitled';
    const sourceContent = jaTranslation?.content || news.content || '';
    const sourceExcerpt = jaTranslation?.excerpt || news.excerpt || '';
    
    // Detect source language from title + content (ignore excerpt to avoid AI-generated contamination)
    // Use stripped text (remove HTML and base64) for accurate detection
    const strippedForDetection = `${sourceTitle} ${sourceContent}`
      .replace(/<img[^>]+src="data:[^"]+"/gi, '') // remove base64 images
      .replace(/<[^>]+>/g, ' ')                   // strip HTML tags
      .substring(0, 3000);
    
    let sourceLanguage = 'en'; // default
    
    // Count character types to determine language
    const japaneseChars = (strippedForDetection.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length;
    const vietnameseChars = (strippedForDetection.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi) || []).length;
    const totalChars = strippedForDetection.replace(/\s/g, '').length || 1;
    
    // If more than 5% of characters are Japanese, treat as Japanese
    if (japaneseChars / totalChars > 0.05) {
      sourceLanguage = 'ja';
      console.log(`[AI News Generator] Detected Japanese content (${japaneseChars}/${totalChars} chars), using ja as source`);
    } 
    // If more than 5% of characters are Vietnamese special chars, treat as Vietnamese
    else if (vietnameseChars / totalChars > 0.05) {
      sourceLanguage = 'vi';
      console.log(`[AI News Generator] Detected Vietnamese content (${vietnameseChars}/${totalChars} chars), using vi as source`);
    } else {
      console.log(`[AI News Generator] No specific language detected (ja: ${japaneseChars}, vi: ${vietnameseChars}, total: ${totalChars}), defaulting to en`);
    }
    
    const jobIds: string[] = [];
    let firstLanguageSummary = '';

    // Reorder target languages to process source language first
    // This ensures firstLanguageSummary is in the source language
    const reorderedLanguages = [
      sourceLanguage as 'ja' | 'en' | 'vi',
      ...targetLanguages.filter(lang => lang !== sourceLanguage)
    ];

    // Keep existing translations until new ones are successfully created
    // We'll update/create them one by one

    for (const targetLang of reorderedLanguages) {
      // Track translation success
      let titleTranslationSuccess = false;
      let excerptTranslationSuccess = false;
      let contentTranslationSuccess = false;
      
      let translatedTitle = sourceTitle;
      let translatedExcerpt = sourceExcerpt;
      let translatedContent = sourceContent;
      let aiSummary = '';

      if (targetLang !== sourceLanguage) {
        console.log(`[AI News Generator] Translating to ${targetLang}...`);

        // Translate title
        const titleJob = await storage.createAiGenerationJob({
          newsId: news.id,
          jobType: 'translation',
          provider: 'openai',
          status: 'processing',
          inputPayload: { type: 'title', sourceLanguage, targetLanguage: targetLang, text: sourceTitle },
        });
        jobIds.push(titleJob.id);

        try {
          const titleResult = await translateWithGPT4({
            sourceText: sourceTitle,
            sourceLanguage,
            targetLanguage: targetLang,
            contentType: 'title',
          });
          translatedTitle = titleResult.translatedText;
          titleTranslationSuccess = true;
          await storage.updateAiGenerationJob(titleJob.id, {
            status: 'completed',
            resultJson: titleResult,
          });
        } catch (error: any) {
          await storage.updateAiGenerationJob(titleJob.id, {
            status: 'failed',
            errorMessage: error.message,
          });
          console.error(`[AI News Generator] Title translation failed:`, error.message);
        }

        // Translate excerpt if available
        if (sourceExcerpt && sourceExcerpt.trim().length > 0) {
          const excerptJob = await storage.createAiGenerationJob({
            newsId: news.id,
            jobType: 'translation',
            provider: 'openai',
            status: 'processing',
            inputPayload: { type: 'excerpt', sourceLanguage, targetLanguage: targetLang, text: sourceExcerpt },
          });
          jobIds.push(excerptJob.id);

          try {
            const excerptResult = await translateWithGPT4({
              sourceText: sourceExcerpt,
              sourceLanguage,
              targetLanguage: targetLang,
              contentType: 'excerpt',
            });
            translatedExcerpt = excerptResult.translatedText;
            excerptTranslationSuccess = true;
            await storage.updateAiGenerationJob(excerptJob.id, {
              status: 'completed',
              resultJson: excerptResult,
            });
          } catch (error: any) {
            await storage.updateAiGenerationJob(excerptJob.id, {
              status: 'failed',
              errorMessage: error.message,
            });
            console.error(`[AI News Generator] Excerpt translation failed:`, error.message);
          }
        }

        // Translate content
        const contentJob = await storage.createAiGenerationJob({
          newsId: news.id,
          jobType: 'translation',
          provider: 'openai',
          status: 'processing',
          inputPayload: { type: 'content', sourceLanguage, targetLanguage: targetLang, text: sourceContent },
        });
        jobIds.push(contentJob.id);

        try {
          // Strip base64 images before translation to reduce token count
          const { sanitizedHtml, imageMappings } = stripBase64Images(sourceContent);
          const estimatedTokens = estimateTokenCount(sanitizedHtml);
          console.log(`[AI News Generator] Content translation - Estimated tokens: ${estimatedTokens}`);
          
          const contentResult = await translateWithGPT4({
            sourceText: sanitizedHtml,
            sourceLanguage,
            targetLanguage: targetLang,
            contentType: 'content',
          });
          
          // Restore base64 images to translated content
          translatedContent = restoreBase64Images(contentResult.translatedText, imageMappings);
          contentTranslationSuccess = true;
          
          await storage.updateAiGenerationJob(contentJob.id, {
            status: 'completed',
            resultJson: contentResult,
          });
        } catch (error: any) {
          await storage.updateAiGenerationJob(contentJob.id, {
            status: 'failed',
            errorMessage: error.message,
          });
          console.error(`[AI News Generator] Content translation failed:`, error.message);
        }
      } else {
        // If source language matches target, no translation needed
        titleTranslationSuccess = true;
        excerptTranslationSuccess = true;
        contentTranslationSuccess = true;
      }

      // Generate AI summary only if content translation succeeded
      // This prevents generating summaries from untranslated English text
      if (contentTranslationSuccess) {
        const summaryJob = await storage.createAiGenerationJob({
          newsId: news.id,
          jobType: 'content_summary',
          provider: 'openai',
          status: 'processing',
          inputPayload: { language: targetLang, text: translatedContent },
        });
        jobIds.push(summaryJob.id);

        try {
          // Strip base64 images from content before generating summary
          const { sanitizedHtml } = stripBase64Images(translatedContent);
          
          const summaryResult = await generateSummaryWithGPT4({
            content: sanitizedHtml,
            language: targetLang,
            maxLength: 200,
          });
          aiSummary = summaryResult.summary;
          
          // Save the first language summary (which is the source language)
          if (targetLang === sourceLanguage) {
            firstLanguageSummary = aiSummary;
          }
          
          await storage.updateAiGenerationJob(summaryJob.id, {
            status: 'completed',
            resultJson: summaryResult,
          });
          console.log(`[AI News Generator] Summary generated for ${targetLang}`);
        } catch (error: any) {
          await storage.updateAiGenerationJob(summaryJob.id, {
            status: 'failed',
            errorMessage: error.message,
          });
          console.error(`[AI News Generator] Summary generation failed:`, error.message);
        }
      } else {
        console.warn(`[AI News Generator] Skipping summary generation for ${targetLang} - content translation failed`);
      }

      // Only update/create translation if content translation succeeded
      // This prevents overwriting existing translations with untranslated English
      if (contentTranslationSuccess) {
        const translationData: InsertNewsTranslation = {
          newsId: news.id,
          locale: targetLang,
          title: translatedTitle,
          excerpt: translatedExcerpt.substring(0, 300),
          content: translatedContent,
          seoTitle: translatedTitle,
          seoDescription: translatedExcerpt.substring(0, 160) || aiSummary.substring(0, 160),
          aiSummary,
        };

        // Check if translation already exists
        const existingTranslation = await storage.getNewsTranslation(news.id, targetLang);
        
        if (existingTranslation) {
          await storage.updateNewsTranslation(existingTranslation.id, translationData);
          console.log(`[AI News Generator] Translation updated for ${targetLang}`);
        } else {
          await storage.createNewsTranslation(translationData);
          console.log(`[AI News Generator] Translation created for ${targetLang}`);
        }
      } else {
        console.warn(`[AI News Generator] Skipping translation save for ${targetLang} - critical translations failed`);
      }
    }

    // Update news to make it internal content with AI summary
    const updateData: any = {
      isExternal: false, // Make it internal content
    };
    
    if (firstLanguageSummary && (!sourceExcerpt || sourceExcerpt.trim().length === 0)) {
      updateData.excerpt = firstLanguageSummary.substring(0, 300);
    }

    await storage.updateNews(news.id, updateData);
    console.log(`[AI News Generator] Updated news to internal content`);

    // Generate image if requested
    if (generateImage && !news.featuredImage) {
      console.log(`[AI News Generator] Generating featured image...`);
      const imageJob = await storage.createAiGenerationJob({
        newsId: news.id,
        jobType: 'image_generation',
        provider: 'openai',
        status: 'processing',
        inputPayload: { prompt: `Professional news article illustration for: ${sourceTitle}` },
      });
      jobIds.push(imageJob.id);

      try {
        const imageResult = await generateImageWithDallE({
          prompt: `Professional, modern news article hero image for an article about: ${sourceTitle}. Clean, minimalist style suitable for a technology blog.`,
          style: 'natural',
          quality: 'standard',
          size: '1792x1024',
        });
        
        const uploadResult = await downloadAndUploadImage(
          imageResult.imageUrl,
          `news-${news.id}-${Date.now()}.png`
        );
        
        await storage.updateNews(news.id, {
          featuredImage: uploadResult.objectPath,
        });

        await storage.updateAiGenerationJob(imageJob.id, {
          status: 'completed',
          resultJson: { 
            ...imageResult, 
            persistentUrl: uploadResult.objectPath,
            publicUrl: uploadResult.publicUrl,
          },
        });
        console.log(`[AI News Generator] Image saved to storage: ${uploadResult.objectPath}`);
      } catch (error: any) {
        await storage.updateAiGenerationJob(imageJob.id, {
          status: 'failed',
          errorMessage: error.message,
        });
        console.error(`[AI News Generator] Image generation/upload failed:`, error.message);
      }
    }

    console.log(`[AI News Generator] ✅ Successfully generated content for news: ${news.id} with ${jobIds.length} AI jobs`);

    return {
      success: true,
      newsId: news.id,
      jobIds,
    };
  } catch (error: any) {
    console.error(`[AI News Generator] Failed to generate content:`, error);
    return {
      success: false,
      jobIds: [],
      error: error.message,
    };
  }
}
