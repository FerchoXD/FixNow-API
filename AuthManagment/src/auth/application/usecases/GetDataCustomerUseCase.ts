import { UserInterface } from "../../domain/repositories/UserInterface";

export class GetDataCustomerUseCase {
    constructor(readonly repository: UserInterface) { }

    async execute(userUuid: string): Promise<any> {
        return await this.repository.getCustomer(userUuid);
    }
}