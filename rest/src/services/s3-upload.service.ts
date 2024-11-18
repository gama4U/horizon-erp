import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../utils/s3-client.utils';

const BUCKET_NAME = 'horizon-express';

type UploadFile = {
  key: string;
  file: Buffer;
}
export async function s3UploadFile({file, key}: UploadFile) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

export async function s3DeleteFile(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  return await s3Client.send(command)
}
 
