import { User } from "../../../domain/entities/User";

export interface EmailPort {
    run(user:User):Promise<void>;
}