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
            
            const result = await this.saveProfileDataUseCase.run(uuid, profileData, req.file, calendar);

            res.status(200).json({ message: 'Datos guardados correctamente.', data: result });
        } catch (err: any) {
            // Manejar errores específicos
            if (err.message === 'Formato de archivo no permitido. Solo JPG, JPEG y PNG son aceptados.') {
                res.status(400).json({ error: err.message });
            } else if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({ error: 'El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.' });
            } else {
                res.status(500).json({ error: 'Ocurrió un error al procesar el archivo.' });
            }
        }
    }
}
