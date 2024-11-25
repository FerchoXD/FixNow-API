import { ChatInterface } from '../../domain/repositories/ChatInterface';

export class SendMessageUseCase {
    constructor(private repository: ChatInterface) {}

    async execute(sender: string, receiver: string, message: string): Promise<any> {
        // Validar que los parámetros son válidos
        if (!sender || !receiver || !message) {
            throw new Error('Todos los campos son obligatorios: sender, receiver, message.');
        }

        // Crear el mensaje
        const newMessage = await this.repository.createMessage(sender, receiver, message);

        return newMessage;
    }
}
