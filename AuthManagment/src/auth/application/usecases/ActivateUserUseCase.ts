import { User } from "../../domain/entities/User";
import { UserInterface } from "../../domain/repositories/UserInterface";


export class ActivateUserUseCase {
    constructor(readonly repository:UserInterface){}

    async run(token:string): Promise<User|any>{
        const response = await this.repository.update(token);
        return response;
    }
}