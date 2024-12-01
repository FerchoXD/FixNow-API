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

            console.log(req.file);
            console.log(req.files);

            if (!uuid) {
                res.status(400).json({ error: 'uuid es requerido' });
                return;
            }

            const files = req.files as Express.Multer.File[];
            console.log(files.length);
            if (files.length > 5) {
                console.log(files.length);
                throw new Error('No puedes subir más de 5 archivos.');
            }

            console.log('Datos de perfil:', profileData);
            console.log('Datos de calendario:', calendar);
            console.log('Archivos:', files);
            
            const result = await this.saveProfileDataUseCase.run(uuid, profileData, files, calendar);

            res.status(200).json({ data: result });
        } catch (err: any) {

            console.log('Error custom pe we:', err);
            // Manejar errores específicos
            if (err.message === 'Formato de archivo no permitido. Solo JPG, JPEG y PNG son aceptados.') {
                res.status(400).json({ error: err.message });
            } else if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400).json({ error: 'El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.' });
            } else if (err.message === 'Usuario no encontrado.') {
                res.status(404).json({ error: err.message });
            }else if (err.message === 'El calendario debe tener al menos un día laboral.') {
                res.status(422).json({ error: err.message });
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                res.status(400).json({ error: 'Demasiados archivos. El límite es 5.' });
            } else{
                console.log('Error custom pe we:', err.message);
                res.status(500).json({ error: 'Ocurrió un error al procesar la actualización.' });
            }
        }
    }
}
