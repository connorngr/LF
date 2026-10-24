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
const PRESIGNED_GET_EXPIRY_SECONDS = 3600

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
): Promise<string> {
  const filename = key.split("/").pop() || ""
  const base = filename.replace(/\.[^.]+$/, "") || filename
  const thumbnailKey = `thumbnails/${base}.webp`

  const thumbnailBuffer = await sharp(body)
    .resize({ width: 400, height: 400, fit: "inside" })
    .webp({ quality: 75 })
    .toBuffer()

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: "image/webp",
    })
  )
  return thumbnailKey
}

/** Signed GET URL for a private R2 object key. */
export async function getUrl(key: string): Promise<string> {
  noStore()
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: PRESIGNED_GET_EXPIRY_SECONDS },
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
