import { UserInterface } from "../../domain/repositories/UserInterface";
import { ImageStorageService } from "../../infraestructure/Services/StorageImages/ImageStorageService";
import { UserImageModel } from "../../infraestructure/models/MySQL/UserImage";

export class SaveProfileDataUseCase {
    constructor(
        private readonly repository: UserInterface,
        private readonly imageStorageService: ImageStorageService
    ) {}

    async run(uuid: string, profileData: any, images: string[]): Promise<any> {
        //console.log('SaveProfileDataUseCase.run', uuid, profileData, images);
        // Paso 1: Subir las imágenes y obtener las URLs
        const imageUrls = await this.imageStorageService.uploadImages(uuid, images);

        // Paso 2: Asignar las URLs de las imágenes al perfil
        profileData.profilefilenames = imageUrls;

        // Paso 3: Guardar los datos del perfil (incluyendo las URLs de las imágenes)
        const response = await this.repository.profileData(uuid, profileData, imageUrls);

        return response;
    }
}
