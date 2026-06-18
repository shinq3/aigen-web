import * as cheerio from 'cheerio';

interface ImagePlaceholder {
  index: number;
  originalSrc: string;
}

/**
 * Strips base64-encoded images from HTML content to reduce token count for AI requests
 * Replaces data URI images with placeholders and returns both sanitized HTML and mapping
 * 
 * @param html - Original HTML content with potential base64 images
 * @returns Object with sanitized HTML and image mappings for restoration
 */
export function stripBase64Images(html: string): { sanitizedHtml: string; imageMappings: ImagePlaceholder[] } {
  if (!html || html.trim() === '') {
    return { sanitizedHtml: html, imageMappings: [] };
  }

  // Load HTML as fragment (don't add html/body wrappers)
  const $ = cheerio.load(html, null, false);
  const imageMappings: ImagePlaceholder[] = [];
  let imageIndex = 0;

  $('img').each((_, element) => {
    const $img = $(element);
    const src = $img.attr('src');
    
    if (src && src.startsWith('data:')) {
      imageMappings.push({
        index: imageIndex,
        originalSrc: src,
      });
      
      $img.attr('src', `__IMAGE_PLACEHOLDER_${imageIndex}__`);
      imageIndex++;
    }
  });

  // Use $.root().html() to get fragment without wrappers
  const sanitizedHtml = $.root().html() || '';
  
  console.log(`[HTML Utils] Stripped ${imageMappings.length} base64 images from content`);
  console.log(`[HTML Utils] Original size: ${html.length} chars, Sanitized size: ${sanitizedHtml.length} chars`);
  
  return { sanitizedHtml, imageMappings };
}

/**
 * Restores base64 images to translated HTML using the original image mappings
 * Validates that all placeholders are present before restoration
 * 
 * @param translatedHtml - HTML content after translation with placeholders
 * @param imageMappings - Original image mappings from stripBase64Images
 * @returns HTML with base64 images restored
 * @throws Error if placeholder count mismatch detected
 */
export function restoreBase64Images(translatedHtml: string, imageMappings: ImagePlaceholder[]): string {
  if (!translatedHtml || imageMappings.length === 0) {
    return translatedHtml;
  }

  // Load HTML as fragment (don't add html/body wrappers)
  const $ = cheerio.load(translatedHtml, null, false);

  // Count placeholders in translated content
  let placeholderCount = 0;
  $('img').each((_, element) => {
    const $img = $(element);
    const src = $img.attr('src');
    if (src && src.startsWith('__IMAGE_PLACEHOLDER_')) {
      placeholderCount++;
    }
  });

  // Validate placeholder count matches original
  if (placeholderCount !== imageMappings.length) {
    console.error(`[HTML Utils] Placeholder mismatch! Expected ${imageMappings.length}, found ${placeholderCount}`);
    console.error(`[HTML Utils] This may indicate the translator dropped or duplicated images`);
    throw new Error(`Image placeholder count mismatch: expected ${imageMappings.length}, found ${placeholderCount}`);
  }

  // Restore images
  let restoredCount = 0;
  $('img').each((_, element) => {
    const $img = $(element);
    const src = $img.attr('src');
    
    if (src && src.startsWith('__IMAGE_PLACEHOLDER_')) {
      const indexMatch = src.match(/__IMAGE_PLACEHOLDER_(\d+)__/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1], 10);
        const mapping = imageMappings.find(m => m.index === index);
        
        if (mapping) {
          $img.attr('src', mapping.originalSrc);
          restoredCount++;
        } else {
          console.warn(`[HTML Utils] No mapping found for placeholder index ${index}`);
        }
      }
    }
  });

  // Use $.root().html() to get fragment without wrappers
  const restoredHtml = $.root().html() || '';
  console.log(`[HTML Utils] Restored ${restoredCount}/${imageMappings.length} base64 images to translated content`);
  
  return restoredHtml;
}

/**
 * Estimates token count for text (rough approximation: 1 token ≈ 4 characters)
 * Used to check if content is within OpenAI limits before making API calls
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}
