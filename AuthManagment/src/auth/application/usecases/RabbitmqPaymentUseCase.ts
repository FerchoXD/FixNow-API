import { UserInterface } from "../../domain/repositories/UserInterface";

export class RabbitmqPaymentUseCase {
    constructor(readonly repository: UserInterface) { }

    async execute(data: any): Promise<any> {
        console.log('Datos recibidos de pagos:', data);
        return await this.repository.rabbitPayment(data);
    }
}