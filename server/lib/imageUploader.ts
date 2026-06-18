// Image uploader utility for downloading and storing images to Wasabi (S3-compatible)
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from '../objectStorage';
import { randomUUID } from 'crypto';

export interface UploadImageResult {
  objectPath: string;
  publicUrl: string;
}

function getBucketName(): string {
  const bucket = process.env.WASABI_BUCKET_NAME;
  if (!bucket) throw new Error('WASABI_BUCKET_NAME not set');
  return bucket;
}

async function uploadBufferToStorage(
  buffer: Buffer,
  objectName: string,
  contentType: string
): Promise<string> {
  const bucket = getBucketName();
  const key = `news-images/${objectName}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return `/objects/news-images/${objectName}`;
}

/**
 * Download an image from a URL and upload it to Wasabi
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  filename?: string
): Promise<UploadImageResult> {
  console.log(`[Image Uploader] Downloading image from: ${imageUrl.substring(0, 100)}...`);

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'image/png';
  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
  const objectName = filename || `ai-image-${randomUUID()}.${ext}`;

  const objectPath = await uploadBufferToStorage(imageBuffer, objectName, contentType);
  const domain = process.env.APP_DOMAIN || '';
  const publicUrl = domain ? `https://${domain}${objectPath}` : objectPath;

  console.log(`[Image Uploader] Image uploaded successfully: ${objectPath}`);
  return { objectPath, publicUrl };
}

/**
 * Process HTML content: extract base64 images, resize with sharp, upload to Wasabi.
 * Returns updated HTML and the first image's object path (for thumbnail use).
 */
export async function processContentImages(
  htmlContent: string,
  newsId: string
): Promise<{ processedContent: string; firstImagePath: string | null }> {
  let sharp: any;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('[Image Uploader] sharp not available, skipping image processing');
    return { processedContent: htmlContent, firstImagePath: null };
  }

  const base64ImgRegex = /<img([^>]+)src="(data:image\/([a-zA-Z+]+);base64,([^"]+))"([^>]*)>/gi;
  let processedContent = htmlContent;
  let firstImagePath: string | null = null;
  const replacements: Array<{ original: string; replacement: string }> = [];

  let match: RegExpExecArray | null;
  while ((match = base64ImgRegex.exec(htmlContent)) !== null) {
    const [fullTag, beforeSrc, , , base64Data, afterSrc] = match;
    try {
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const resized = await sharp(imageBuffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const objectName = `content-${newsId}-${randomUUID()}.jpg`;
      const objectPath = await uploadBufferToStorage(resized, objectName, 'image/jpeg');

      if (!firstImagePath) firstImagePath = objectPath;

      const newTag = `<img${beforeSrc}src="${objectPath}"${afterSrc}>`;
      replacements.push({ original: fullTag, replacement: newTag });

      console.log(`[Image Uploader] Processed base64 image → ${objectPath}`);
    } catch (err) {
      console.error('[Image Uploader] Failed to process image:', err);
    }
  }

  for (const { original, replacement } of replacements) {
    processedContent = processedContent.replace(original, replacement);
  }

  return { processedContent, firstImagePath };
}
