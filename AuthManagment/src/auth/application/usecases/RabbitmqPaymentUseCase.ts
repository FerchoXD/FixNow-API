import { UserInterface } from "../../domain/repositories/UserInterface";

export class RabbitmqPaymentUseCase {
    constructor(readonly repository: UserInterface) { }

    async run(data: any): Promise<void> {
        console.log('Datos recibidos de pagos:', data);
        await this.repository.save(data);
    }
}