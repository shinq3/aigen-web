import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Response } from "express";
import { Readable } from "stream";

function createS3Client(): S3Client {
  const endpoint = process.env.WASABI_ENDPOINT || "s3.ap-northeast-1.wasabisys.com";
  const region = process.env.WASABI_REGION || "ap-northeast-1";
  const accessKeyId = process.env.WASABI_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.WASABI_SECRET_ACCESS_KEY || "";

  if (!accessKeyId || !secretAccessKey) {
    console.warn("[ObjectStorage] WASABI_ACCESS_KEY_ID or WASABI_SECRET_ACCESS_KEY not set");
  }

  return new S3Client({
    endpoint: `https://${endpoint}`,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

export const s3Client = createS3Client();

function getBucketName(): string {
  const bucket = process.env.WASABI_BUCKET_NAME;
  if (!bucket) throw new Error("WASABI_BUCKET_NAME not set");
  return bucket;
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  constructor() {}

  // /objects/news-images/xxx.jpg → news-images/xxx.jpg
  private objectPathToKey(objectPath: string): string {
    if (!objectPath.startsWith("/objects/")) throw new ObjectNotFoundError();
    return objectPath.replace(/^\/objects\//, "");
  }

  async getObjectEntityFile(objectPath: string): Promise<string> {
    const key = this.objectPathToKey(objectPath);
    const bucket = getBucketName();
    try {
      await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      return key;
    } catch {
      throw new ObjectNotFoundError();
    }
  }

  async downloadObject(key: string, res: Response, cacheTtlSec: number = 3600) {
    try {
      const bucket = getBucketName();
      const result = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

      res.set({
        "Content-Type": result.ContentType || "application/octet-stream",
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });
      if (result.ContentLength) {
        res.set("Content-Length", String(result.ContentLength));
      }

      (result.Body as Readable).pipe(res);
    } catch (error) {
      console.error("[ObjectStorage] Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
}
