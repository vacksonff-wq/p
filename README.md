# Upload Fast (Vercel + S3 presigned POST)
This project demonstrates a simple frontend (static) + Vercel API that issues S3 presigned POST fields.
Files are uploaded directly from browser to S3 (so Vercel does not proxy the file), and you receive a download URL.

## How to use
1. Create an AWS S3 bucket (e.g. my-fast-downloads).
2. (Recommended) Create a CloudFront distribution pointing to the S3 bucket for fastest global downloads.
3. Add environment variables in Vercel:
   - AWS_REGION
   - S3_BUCKET
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - CLOUDFRONT_DOMAIN (optional)
4. Deploy to Vercel (connect repo or use `vercel` CLI).
5. Open the site and upload files. Download link will be returned after upload.

## Notes
- For very fast global downloads use CloudFront with proper Cache-Control headers.
- Presigned POST expires quickly (60s); feel free to adjust in `api/get-presign.js`.
