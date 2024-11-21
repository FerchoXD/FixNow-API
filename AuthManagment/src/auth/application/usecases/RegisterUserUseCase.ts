import { Contact } from "../../domain/entities/Contact";
import { Status } from "../../domain/entities/Status";
import { Credential } from "../../domain/entities/Credential";
import { User } from "../../domain/entities/User";
import { UserProfile } from "../../domain/entities/UserProfile";
import { UserInterface } from "../../domain/repositories/UserInterface";

export class RegisterUserUseCase {
    constructor(readonly repository: UserInterface) {}

    async run(
        firstname: string,
        lastname: string,
        fullname: string,
        phone: string,
        email: string,
        password: string,
        role: 'CUSTOMER' | 'SUPPLIER'
    ): Promise<User | any> {
        try {
            let contact = new Contact(firstname, lastname,fullname, email, phone, role);
            let credential = new Credential(email, password);
            await credential.setHashPassword();

            let status = new Status(new Date());
            let userProfile = new UserProfile();
            let user = new User(contact, credential, status, userProfile, '', contact.fullname);
            
            const response = await this.repository.save(user);
            return response;
        } catch (error) {
            return error;
        }
    }
}
