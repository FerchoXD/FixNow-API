import { Request, Response } from 'express';
import { SaveProfileDataUseCase } from '../../application/usecases/SaveProfileDataUseCase';
import { ImageStorageService } from '../Services/StorageImages/ImageStorageService';
import { UserMySqlRepository } from '../../infraestructure/repositories/UserMySqlRepository';

export class SaveProfileDataController {
    private saveProfileDataUseCase: SaveProfileDataUseCase;

    constructor() {
        const imageStorageService = new ImageStorageService(); // Corregimos la creación de la instancia de ImageStorageService
        const userRepository = new UserMySqlRepository();
        this.saveProfileDataUseCase = new SaveProfileDataUseCase(userRepository, imageStorageService);
    }

    // Controlador para manejar la actualización del perfil
    async saveProfileData(req: Request, res: Response): Promise<void> {
        try {
            //console.log(req.body);
            const { uuid, profileData, images } = req.body;  // Asegúrate de que el cuerpo tiene estos datos
            const user = await this.saveProfileDataUseCase.run(uuid, profileData, images);
            res.status(200).json(user);  // Retornamos el usuario actualizado
        } catch (error) {
            res.status(500).json({ error: error });  // Manejamos errores
        }
    }
}
