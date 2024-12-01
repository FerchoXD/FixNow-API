import { UserInterface } from '../../domain/repositories/UserInterface';
import { ImageStorageService } from '../../infraestructure/Services/StorageImages/ImageStorageService';

export class SaveProfileDataUseCase {
    constructor(
        private readonly repository: UserInterface,
        private readonly imageStorageService: ImageStorageService,
    ) {}

    async run(uuid: string, profileData: any, files: Express.Multer.File[], calendar: []): Promise<any> {
        try {

            console.log('files:', files);
            
            const imageUrls = files && files.length > 0 
                ? await this.imageStorageService.uploadImages(uuid, files) 
                : []; 

            const calendarToUse = calendar && calendar.length > 0 
            ? calendar 
            : [];
            
            const profileDataToUse = profileData && Object.keys(profileData).length > 0 
                ? profileData 
                : {};

            console.log('Imagenes subidas:', imageUrls);

            console.log('profileData:', profileData);

            console.log('uuid:', uuid);

            console.log('imageUrls:', imageUrls);

            console.log('calendar:', calendar);

            const updatedProfile = await this.repository.profileData(uuid, profileDataToUse, imageUrls, calendarToUse);

            console.log('Perfil actualizado:', updatedProfile);

            return updatedProfile;
        } catch (error: any) {
            console.error('Error en SaveProfileDataUseCase:', error.message);
            if (error.message === 'Usuario no encontrado.') {
                throw new Error('Usuario no encontrado.');
            }
            if (error.message === 'El calendario debe tener al menos un día laboral.') {
                throw new Error('El calendario debe tener al menos un día laboral.');
            }
            throw new Error('No se pudo guardar el perfil.');
        }
    }
}
