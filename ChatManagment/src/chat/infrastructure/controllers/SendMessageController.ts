import { Request, Response } from 'express';
import { SendMessageUseCase } from '../../application/usescase/SendMessageUseCase';

export class SendMessageController {
  constructor(private readonly usecase: SendMessageUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      // Validar entrada
      const { userId, recipientId } = req.params;
      const { content } = req.body;

      if (!userId || !recipientId || !content) {
        res.status(400).json({
          error: 'Faltan parámetros obligatorios: userId, recipientId o content.',
        });
        return;
      }
      console.log('POST /chat/:userId/:recipientId', { userId, recipientId, content });
      // Llamar al caso de uso
      const savedMessage = await this.usecase.execute({ sender: userId, receiver: recipientId, content: content });

      // Responder con el mensaje guardado
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error('Error en SendMessageController:', error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
  }
}
