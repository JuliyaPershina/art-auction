
// import {
//   S3Client,
//   GetObjectCommand,
//   PutObjectCommand,
// } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { env } from '../env';

// const r2Client = new S3Client({
//   region: 'auto',
//   endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
//     secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
//   },
// });

// export async function getSignedUploadUrlForR2Object(key: string, type: string) {
//   return await getSignedUrl(
//     r2Client,
//     new PutObjectCommand({
//       Bucket: env.BUCKET_NAME,
//       Key: key,
//       ContentType: type,
//     }),
//     { expiresIn: 3600 } // 1 година
//   );
// }

// export async function getSignedReadUrlForR2Object(key: string) {
//   return await getSignedUrl(
//     r2Client,
//     new GetObjectCommand({
//       Bucket: env.BUCKET_NAME,
//       Key: key,
//     }),
//     { expiresIn: 3600 } // 1 година
//   );
// }
