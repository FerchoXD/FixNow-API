import { UserInterface } from "../../domain/repositories/UserInterface";

export class RabbitMQHistoryUseCase {
    constructor(readonly repository:UserInterface){}

    async execute(uuid:string):Promise<any> {
        console.log('RabbitMQHistoryUseCase:', uuid);
        const response = await this.repository.rabbitHistory(uuid);
        return response;
    }
}