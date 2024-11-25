import { UserInterface } from "../../domain/repositories/UserInterface";
import { ImageStorageService } from "../../infraestructure/Services/StorageImages/ImageStorageService";
import { UserImageModel } from "../../infraestructure/models/MySQL/UserImage";

export class SaveProfileDataUseCase {
    constructor(
        private readonly repository: UserInterface,
        private readonly imageStorageService: ImageStorageService
    ) {}

    async run(uuid: string, profileData: any, images: string[]): Promise<any> {

        const response = await this.repository.profileData(uuid, profileData,images);


        if (images && images.length > 0) {
            const uploadedImages = await this.imageStorageService.uploadImages(uuid, images);
            await this.repository.updateUserImages(uuid, uploadedImages);
        }

        return response;
    }
}
