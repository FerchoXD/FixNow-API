import { Request, Response } from 'express';
import { SaveProfileDataUseCase } from '../../application/usecases/SaveProfileDataUseCase';
import { ImageStorageService } from '../Services/StorageImages/ImageStorageService';
import { UserMySqlRepository } from '../../infraestructure/repositories/UserMySqlRepository';

export class SaveProfileDataController {
    private saveProfileDataUseCase: SaveProfileDataUseCase;

    constructor() {
        const imageStorageService = new ImageStorageService();
        const userRepository = new UserMySqlRepository();
        this.saveProfileDataUseCase = new SaveProfileDataUseCase(userRepository, imageStorageService);
    }

    async saveProfileData(req: Request, res: Response): Promise<void> {
        try {
            const { uuid, profileData, images } = req.body;
    
            // Asegúrate de que imagesToUpdate sea un arreglo, incluso si no hay imágenes
            const imagesToUpdate: string[] = Array.isArray(images) ? images : [];
    
            const user = await this.saveProfileDataUseCase.run(uuid, profileData, imagesToUpdate); 
            res.status(200).json(user); // Retornamos el usuario actualizado
        } catch (error) {
            console.error('Error al guardar los datos del perfil:', error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message }); // Manejamos errores
            } else {
                res.status(500).json({ error: 'Unknown error' }); // Manejamos errores
            }
        }
    }
    
}
