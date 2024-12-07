import { HistoryInterface } from "../../domain/repositories/HistoryInterface";

export class ChangeStatusUseCase {
    constructor(readonly repository:HistoryInterface){}

    async execute(serviceUuid:string, status:string):Promise<any> {
        console.log('ChangeStatusUseCase:', serviceUuid, status);
        const response = await this.repository.changeStatus(serviceUuid, status);
        return response;
    }
}