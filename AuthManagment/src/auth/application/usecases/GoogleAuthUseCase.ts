import { UserInterface } from '../../domain/repositories/UserInterface';

export class GoogleAuthUseCase {
  constructor(readonly repository:UserInterface) {}

    async authenticateWithGoogle(id:any,name:any,email:any,picture:any ): Promise<any> {
        const user = await this.repository.findByGoogleId(id);
        if (user) {
            return user;
        }
        const newUser = await this.repository.authenticateWithGoogle(id,name,email,picture);
        return newUser;
    }
}
