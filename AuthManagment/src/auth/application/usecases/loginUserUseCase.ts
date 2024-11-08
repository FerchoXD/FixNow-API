import { UserInterface } from "../../domain/repositories/UserInterface";


export class LoginUserUseCase {
    constructor(readonly repository:UserInterface){}

    async run(email:string, password:string):Promise<any> {
        return await this.repository.login(email, password);
    }
}