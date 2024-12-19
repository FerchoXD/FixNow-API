import { Request, Response } from 'express';
import { SearchSuppliersUseCase } from '../../application/usecases/SearchSuppliersUseCase';

export class SearchSuppliersController {
    constructor(readonly usecase: SearchSuppliersUseCase) { }
    async run(req: Request, res: Response): Promise<void> {
        try {
            // Validar entrada
            const { prompt } = req.body;
            if (!prompt || typeof prompt !== 'string') {
                res.status(400).json({ error: 'El campo "prompt" es requerido y debe ser una cadena de texto.' });
                return;
            }

            // Lógica principal (será implementada más adelante)
            const suppliers = await this.usecase.execute(prompt);
            
            // Respuesta exitosa
            res.status(200).json({ suppliers });
        } catch (error) {
            const errorMessage = (error as Error).message;
            console.error('Error en searchSuppliersController:', errorMessage);

            if (errorMessage === 'No se detectaron palabras clave en el prompt.') {
                res.status(400).json({ error: 'No se detectaron palabras clave en el prompt.' });
                return;
            }

            res.status(500).json({ error: "ocurrio un error al procesar la solicitud" });
        }
    }
}
