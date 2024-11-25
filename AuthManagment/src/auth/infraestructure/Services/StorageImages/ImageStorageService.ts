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

    async uploadImages(uuid: string, images: string[]): Promise<string[]> {
        const urls: string[] = [];
        for (const [index, base64Image] of images.entries()) {
            const buffer = Buffer.from(base64Image, 'base64');
            const fileName = `supplier-profile/${uuid}/image-${index + 1}.jpg`;

            try {
                const command = new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: buffer,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read', // Permitir acceso público si es necesario
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
