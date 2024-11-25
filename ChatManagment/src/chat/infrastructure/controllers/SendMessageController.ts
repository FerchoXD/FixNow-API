import { Request, Response } from 'express';
import { SendMessageUseCase } from '../../application/usescase/SendMessageUseCase';
export class SendMessageController {

    constructor(readonly sendMessageUseCase: SendMessageUseCase) { }
    
    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { sender, receiver, message } = req.body;

            if (!sender || !receiver || !message) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios: sender, receiver, message.' });
            }

            const newMessage = await this.sendMessageUseCase.execute(sender, receiver, message);

            return res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            const errorMessage = (error as Error).message || 'Error interno del servidor.';
            return res.status(500).json({ message: errorMessage });
        }
    }
}
