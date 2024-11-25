import { CreatePostUseCase } from '../../application/usescase/CreatePostUseCase';
import { Response, Request } from 'express';

export class CreatePostController {
    constructor(readonly useCase: CreatePostUseCase) { }

    async run(req: Request, res: Response): Promise<any> {
        const { username, title, content, time } = req.body;

        console.log('CreatePostController');

        // Validaciones
        const errors: string[] = [];

        // Validar que los campos requeridos estén presentes
        if (!username || typeof username !== 'string') {
            errors.push('El campo "username" es requerido y debe ser una cadena.');
        }

        if (!title || typeof title !== 'string') {
            errors.push('El campo "title" es requerido y debe ser una cadena.');
        } else if (title.length > 100) {
            errors.push('El campo "title" no debe exceder los 100 caracteres.');
        }

        if (!content || typeof content !== 'string') {
            errors.push('El campo "content" es requerido y debe ser una cadena.');
        } else if (content.length > 5000) {
            errors.push('El campo "content" no debe exceder los 5000 caracteres.');
        }

        if (!time || isNaN(Date.parse(time))) {
            errors.push('El campo "time" es requerido y debe ser una fecha válida.');
        }

        // Responder con errores si existen
        if (errors.length > 0) {
            return res.status(400).send({
                message: 'Errores de validación',
                errors,
            });
        }

        try {
            // Ejecutar el caso de uso
            const result = await this.useCase.execute(username, title, content, new Date(time));
            console.log(result);

            // Responder con el resultado
            res.send(result);
        } catch (error) {
            console.error(error);

            res.status(500).send({
                message: 'Ocurrió un error en el servidor.',
                error: (error as Error).message || error,
            });
        }
    }
}
