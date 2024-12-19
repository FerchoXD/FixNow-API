import { Request, Response } from 'express';
import { RecomendationChatUseCase } from '../../application/usescase/RecomendationChatUseCase';

export class RecomendationChatController {
    constructor(readonly usecase: RecomendationChatUseCase) {}

    async run(req: Request, res: Response): Promise<any> {
        const { userUuid, content } = req.body;

        if (!userUuid || !content) {
            res.status(400).send({
                message: 'Faltan parametros obligatorios.',
            });
            return;
        }

        try {
            const response = await this.usecase.execute(userUuid, content);
            res.status(201).send({ message: response });
        } catch (error:any) {
            const errorMessage = (error as Error).message || error;
            console.error('Error al obtener la recomendacion:', errorMessage);
            res.status(500).send({
                error: error.message,
            });
        }
    }
}
