import { UserInterface } from "../../domain/repositories/UserInterface";

export class RabbitmqRaitingUseCase {
    constructor(readonly repository: UserInterface) { }

    async execute(userUuid: any, polaridad :any): Promise<any> {
        console.log('Datos recibidos de pagos:', userUuid);
        console.log('Datos recibidos de pagos:', polaridad );
        return await this.repository.rabbitRaiting(userUuid, polaridad );
    }
}