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
            const { uuid, profileData, calendar } = req.body;

            // Validar la imagen cargada por Multer
            if (!req.file) {
                res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });
                return;
            }

            const uploadedImage = req.file;

            // Actualizar calendario (si aplica)
            const calendarToUpdate: string[] = Array.isArray(calendar) ? calendar : [];

            // Ejecutar el caso de uso
            //const user = await this.saveProfileDataUseCase.run(uuid, profileData, uploadedImage, calendarToUpdate);

            //res.status(200).json(user); // Retornamos el usuario actualizado
        } catch (error) {
            console.error('Error al guardar los datos del perfil:', error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message }); // Manejo de errores
            } else {
                res.status(500).json({ error: 'Error desconocido' });
            }
        }
    }
}
