import { Service } from "@google-cloud/storage/build/cjs/src/nodejs-common";
import { UserMySqlRepository } from "../../infraestructure/repositories/UserMySqlRepository";

export class GetServicesUseCase {
    constructor(readonly serviceRepository: UserMySqlRepository) {}

    async run(uuid:string): Promise<any> {
        try {
            return await this.serviceRepository.getServices(uuid);
        } catch (error) {
            return error;
        }
    }
}