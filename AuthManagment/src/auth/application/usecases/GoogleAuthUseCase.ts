import { UserInterface } from '../../domain/repositories/UserInterface';

export class GoogleAuthUseCase {
  constructor(readonly repository:UserInterface) {}

    async authenticateWithGoogle(id:any,name:any,email:any,picture:any ): Promise<any> {
        console.log("id desde usecase", id);
        console.log("name desde usecase", name);
        console.log("email desde usecase", email);
        console.log("picture desde usecase", picture);
        const user = await this.repository.findByGoogleId(id);
        console.log("user desde usecase", user);
        if (user) {
            console.log("entro al if de use case", user);
            return user;
        }
        const newUser = await this.repository.authenticateWithGoogle(id,name,email,picture);
        console.log("newUser desde usecase", newUser);
        return newUser;
    }
}
