import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import sharp from "sharp"
import { r2AccessKeyId, r2AccountId, r2BucketName, r2SecretAccessKey } from "./env"

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
})

const BUCKET = r2BucketName

export async function uploadToR2(
  body: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return key
}

export async function uploadThumbnailToR2(
  body: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  // Extract filename from key (e.g., "images/12345-abc.jpg" → "12345-abc.jpg")
  const filename = key.split('/').pop() || ''
  const thumbnailKey = `thumbnails/${filename}`
  
  const thumbnailBuffer = await sharp(body)
    .resize({ width: 400, height: 400, fit: "inside" })
    .toBuffer()

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: contentType,
    })
  )
  return thumbnailKey
}

export async function getUrl(key: string): Promise<string> {
  return await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 3600 },
  )
}