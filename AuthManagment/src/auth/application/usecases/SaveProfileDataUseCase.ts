import { UserInterface } from "../../domain/repositories/UserInterface";
import { ImageStorageService } from "../../infraestructure/Services/StorageImages/ImageStorageService";
import { UserImageModel } from "../../infraestructure/models/MySQL/UserImage";

export class SaveProfileDataUseCase {
    constructor(
        private readonly repository: UserInterface,
        private readonly imageStorageService: ImageStorageService
    ) {}

    async run(uuid: string, profileData: any, images: any, calendar: any[]): Promise<any> {

        console.log('images', images);

        const response = await this.repository.profileData(uuid, profileData,images, calendar);


        if (images) {

            return "todo chido";
            const uploadedImages = await this.imageStorageService.uploadImages(uuid, images);
            await this.repository.updateUserImages(uuid, uploadedImages);
        }

        return response;
    }
}
