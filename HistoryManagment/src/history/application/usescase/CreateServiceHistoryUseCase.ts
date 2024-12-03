import { HistoryInterface } from "../../domain/repositories/HistoryInterface";

export class CreateServiceHistoryUseCase {
    constructor(readonly repository: HistoryInterface) { }

    async execute(customerUuid:string,supplierUuid:string,title: string, description: string, agreedPrice:number, agreedDate:Date): Promise<any> {
        console.log('CreateServiceHistoryUseCase');
        return await this.repository.create(customerUuid,supplierUuid,title, description, agreedPrice, agreedDate);
    }
}