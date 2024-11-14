import { Storage } from '@google-cloud/storage';

export class ImageStorageService {
    private storage = new Storage({ keyFilename: 'src/auth/infraestructure/Services/StorageImages/credentials.json' });
    private bucketName = 'fixnow';

    async uploadImages(uuid: string, images: string[]): Promise<string[]> {
        const urls: string[] = [];
        for (const [index, base64Image] of images.entries()) {
            const buffer = Buffer.from(base64Image, 'base64');
            const fileName = `supplier-profile/${uuid}/image-${index + 1}.jpg`;
            const file = this.storage.bucket(this.bucketName).file(fileName);
            //this.storage.bucket(this.bucketName).makePublic();

            try {
                await file.save(buffer, { metadata: { contentType: 'image/jpeg' } });
            } catch (error) {
                console.error('Error subiendo la imagen:', error);
                throw error;
            }
            
            const url = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
            urls.push(url);
        }
        return urls;
    }
}
