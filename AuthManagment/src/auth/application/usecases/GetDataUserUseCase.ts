import { UserInterface } from "../../domain/repositories/UserInterface";

export class GetDataUserUseCase {
    constructor(readonly repository: UserInterface) { }

    async execute(userId: string) {
        const user = await this.repository.findProfileById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }
}