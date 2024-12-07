import { UserInterface } from '../../domain/repositories/UserInterface';

export class RabbitmqTokenfcmUsecase {
    constructor(readonly repository: UserInterface) { }

    async execute(userUuid:string): Promise<any> {
        console.log('RabbitMQHistoryTokenfcmUseCase');
        const response = await this.repository.findTokenfcmForHistory(userUuid);
        return response;
    }
}
