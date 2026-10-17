import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/** Image storage on an S3-compatible bucket (Neon Storage). The bucket is private: files are read back through /api/media. */
const bucket = () => process.env.STORAGE_BUCKET || "images";

// Created on first use, so a missing setting only breaks uploads, not every page.
let client: S3Client | undefined;
const s3 = () =>
  (client ??= new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
  }));

export const storage = {
  put: (key: string, body: Uint8Array, contentType: string) =>
    s3().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType })),

  /** A missing file is fine to delete, so this never throws for it. */
  async remove(key: string) {
    try {
      await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
    } catch (error) {
      console.error("[storage] delete failed", key, error);
    }
  },

  get: (key: string) => s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key })),
};
