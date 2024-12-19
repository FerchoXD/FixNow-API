import { GetFiltersUseCase } from "../../application/usecases/GetFiltersUseCase";
import { Request, Response } from 'express';

export class GetFiltersController {
    constructor(private readonly getFiltersUseCase: GetFiltersUseCase) {}

    async run(req: Request, res: Response) {
        try {
            // Destructura los filtros del body correctamente
            const { relevance, quotation, hourlyrate, service } = req.body;

            if(relevance < 0 || relevance > 5) {
                return res.status(400).json({ error: 'Relevance must be between 0 and 5' });
            }

            const filters = await this.getFiltersUseCase.execute({
                relevance,
                service,
                quotation,
                hourlyrate,
            });

            if (!filters) {
                return res.status(404).json({ error: 'Filters not found' });
            }

            return res.status(200).json(filters);
        } catch (error) {
            console.error("Error al obtener los filtros:", error);
            return res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }
}
