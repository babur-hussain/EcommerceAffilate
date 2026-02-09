import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'lfv-stories';

export interface PresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    key: string;
}

/**
 * Generate a presigned URL for uploading a file directly to S3
 */
export async function generatePresignedUploadUrl(
    userId: string,
    fileName: string,
    contentType: string
): Promise<PresignedUrlResponse> {
    // Create unique key with user folder structure
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `stories/${userId}/${timestamp}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType
    });

    // Generate presigned URL valid for 10 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    // The public URL for accessing the file after upload
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;

    return {
        uploadUrl,
        fileUrl,
        key
    };
}

/**
 * Generate a presigned URL for reading a file from S3
 */
export async function generatePresignedReadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    // Generate presigned URL valid for 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    await s3Client.send(command);
}

/**
 * Extract S3 key from full URL
 */
export function extractKeyFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        // Remove leading slash
        return urlObj.pathname.substring(1);
    } catch {
        return null;
    }
}

export default {
    generatePresignedUploadUrl,
    generatePresignedReadUrl,
    deleteFromS3,
    extractKeyFromUrl
};
