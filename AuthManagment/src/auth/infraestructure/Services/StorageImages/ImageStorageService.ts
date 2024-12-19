import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class ImageStorageService {
    private s3Client: S3Client;
    private bucketName = 'fixnow';

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async uploadImages(uuid: string, files: Express.Multer.File[]): Promise<string[]> {
        const urls: string[] = [];

        for (const [index, file] of files.entries()) {
            const fileName = `supplier-profile/${uuid}/image-${index + 1}-${Date.now()}.jpg`;

            try {
                const command = new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read',
                });

                await this.s3Client.send(command);

                const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
                urls.push(url);
            } catch (error) {
                console.error('Error subiendo la imagen a S3:', error);
                throw error;
            }
        }

        return urls;
    }
}
