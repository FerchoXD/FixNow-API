import { UserProfile } from "../../domain/entities/UserProfile";
import { UserMySqlRepository } from "../../infraestructure/repositories/UserMySqlRepository";
import { NotFoundError } from "../errors/NotFoundError";


export class GetProfileUseCase {
    constructor(private repository: UserMySqlRepository) {}

    async execute(uuid: string): Promise<UserProfile> {
        console.log('Buscando perfil de usuario con el id:', uuid);
        const user = await this.repository.findProfileById(uuid);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }
}