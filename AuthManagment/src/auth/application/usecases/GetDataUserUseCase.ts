import { UserInterface } from "../../domain/repositories/UserInterface";

export class GetDataUserUseCase {
    constructor(readonly repository: UserInterface) { }

    async execute(userUuid: string): Promise<any> {

        return await this.repository.getData(userUuid);
    }
}