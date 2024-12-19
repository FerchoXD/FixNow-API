import { ImageStorageService } from './ImageStorageService';
import { UserImageModel } from '../../models/MySQL/UserImage'; 
/*
export class HandleProfileImages {
    private imageStorageService: ImageStorageService;

    constructor() {
        this.imageStorageService = new ImageStorageService();
    }

    // Método para manejar la subida de imágenes y guardar las URLs
    async handleProfileImages(uuid: string, images: string[]): Promise<string[]> {
        const imageUrls = await this.imageStorageService.uploadImages(uuid, images);

        // Insertar las URLs en la tabla 'user_images' para ese usuario
        for (const imageUrl of imageUrls) {
            await UserImageModel.create({
                userId: uuid,
                imageUrl: imageUrl, // Guardamos la URL generada
            });
        }

        return imageUrls; // Devuelve las URLs para usarlas si es necesario
    }
}
    */
