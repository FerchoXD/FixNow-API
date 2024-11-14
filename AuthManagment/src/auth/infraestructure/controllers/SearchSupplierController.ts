import { Request, Response } from 'express';
import { NotFoundError } from '../../application/errors/NotFoundError';
import { SearchSupplierUseCase } from '../../application/usecases/SearchSupplierUseCase';

export class SearchSupplierController {
    private searchSupplierUseCase: SearchSupplierUseCase;

    constructor(searchSupplierUseCase: SearchSupplierUseCase) {
        this.searchSupplierUseCase = searchSupplierUseCase;
    }

    async run(req: Request, res: Response) {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido' });
        }

        try {
            const providers = await this.searchSupplierUseCase.execute(prompt);
            console.log("providers", providers.data);

            if (providers.data.length === 0) {
                throw new NotFoundError('No se encontraron proveedores para el servicio solicitado.');
            }

            return res.status(200).json(providers);
        } catch (error) {
            console.error('Error al buscar proveedores:', error);

            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }

            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
