import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { unstable_noStore as noStore } from "next/cache"
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
const PRESIGNED_UPLOAD_EXPIRY_SECONDS = 600

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
): Promise<string> {
  return getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: PRESIGNED_UPLOAD_EXPIRY_SECONDS },
  )
}

export async function headObjectFromR2(key: string): Promise<{
  contentLength: number
  contentType: string
}> {
  const response = await r2.send(
    new HeadObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  )

  return {
    contentLength: response.ContentLength ?? 0,
    contentType: response.ContentType ?? "",
  }
}

export async function getObjectBufferFromR2(key: string): Promise<Buffer> {
  const response = await r2.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  )
  const bytes = await response.Body?.transformToByteArray()
  if (!bytes) {
    throw new Error(`Empty object: ${key}`)
  }
  return Buffer.from(bytes)
}

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
  noStore()
  return await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 3600 },
  )
}

export async function deleteFromR2(key: string): Promise<void> {
  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    )
  } catch (error) {
    console.error(`Failed to delete R2 object: ${key}`, error)
  }
}