import { CreateServiceHistoryUseCase } from '../../application/usescase/CreateServiceHistoryUseCase';
import { Response, Request } from 'express';

export class CreateServiceHistoryController {
    constructor(readonly useCase: CreateServiceHistoryUseCase) { }

    async run(res: Response, req: Request): Promise<any> {
        console.log(req.body);
        const {customerUuid,supplierUuid,title, description, agreedPrice, agreedDate } = req.body;
        if (!title || !description || !agreedPrice || !agreedDate) {
            return res.status(400).send({
                message: 'Faltan campos obligatorios.',
            });
        }

        try {
            const result = await this.useCase.execute(customerUuid,supplierUuid,title, description, agreedPrice, agreedDate);
            console.log(result);
    
            if (!result || (Array.isArray(result) && result.length === 0)) {
                return res.status(400).send({
                    message: 'No se encontraron resultados.',
                });
            }

            if (result.status === 400) {
                return res.status(400).send({
                    status: 400,
                    message: result.message,
                });
            }

            if (result.error === 500) {
                return res.status(500).send({
                    message: 'Ocurrió un error en el servidor.',
                    error: (result as Error).message || result,
                });
            }

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