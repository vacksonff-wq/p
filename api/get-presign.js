import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET;

const s3 = new S3Client({ region: REGION });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { filename, contentType } = req.body;
    if (!filename) return res.status(400).json({ error: 'filename required' });

    const key = `uploads/${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g,'_')}`;

    const presigned = await createPresignedPost(s3, {
      Bucket: BUCKET,
      Key: key,
      Conditions: [
        ["content-length-range", 0, 1024 * 1024 * 1024],
        { acl: 'private' }
      ],
      Fields: {
        acl: 'private',
        'Content-Type': contentType || 'application/octet-stream'
      },
      Expires: 60
    });

    const downloadUrl = process.env.CLOUDFRONT_DOMAIN
      ? `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`
      : `https://${BUCKET}.s3.amazonaws.com/${key}`;

    res.status(200).json({ presigned, key, downloadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
