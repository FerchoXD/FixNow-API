import { UserInterface } from "../../domain/repositories/UserInterface";

export class RabbitMQHistoryCustomerUseCase {
    constructor(readonly repository:UserInterface){}

    async execute(uuid:string):Promise<any> {
        console.log('RabbitMQHistoryUseCase:', uuid);
        const response = await this.repository.rabbitHistoryCustomer(uuid);
        console.log('Respuesta de RabbitMQHistoryUseCase:', response);
        return response;
    }
}