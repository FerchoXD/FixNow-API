import { Request, Response } from 'express';
import { CreateCommentUseCase } from '../../application/usescase/CreateCommentUseCase';

export class CreateCommentController {
    private createCommentUseCase: CreateCommentUseCase;

    constructor(createCommentUseCase: CreateCommentUseCase) {
        this.createCommentUseCase = createCommentUseCase;
    }

    async run(req: Request, res: Response): Promise<void> {
        const { username, postUuid, content, time } = req.body;

        const errors: string[] = [];

        if (!username || typeof username !== 'string') {
            errors.push('El campo "username" es requerido y debe ser una cadena.');
        }

        if (!postUuid || typeof postUuid !== 'string') {
            errors.push('El campo "postUuid" es requerido y debe ser una cadena.');
        }
        if (!content || typeof content !== 'string') {
            errors.push('El campo "content" es requerido y debe ser una cadena.');
        }

        if (errors.length > 0) {
            res.status(400).send({
                message: 'Errores de validación',
                errors,
            });
            return;
        }

        try {
            const response = await this.createCommentUseCase.execute(username,postUuid, content, new Date(time));
            res.status(201).send({ message: response });
        } catch (error) {
            const errorMessage = (error as Error).message || error;
            console.error('Error al crear el comentario:', errorMessage);
            res.status(500).send({
                message: 'Ocurrió un error al crear el comentario.',
                error: (error as Error).message || error,
            });
        }
    }
}
