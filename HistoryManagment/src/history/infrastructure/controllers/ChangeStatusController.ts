import { Request, Response } from 'express';
import { ChangeStatusUseCase } from '../../application/usescase/ChangeStatusUseCase';

export class ChangeStatusController {
    constructor(readonly usecase:ChangeStatusUseCase){}
    async run(req:Request, res:Response):Promise<any> {
        const { serviceUuid, status } = req.body;

        if (!serviceUuid || !status) {
            return res.status(400).json({ error: 'UUID y status son requeridos' });
        }

        const response = await this.usecase.execute(serviceUuid, status);
        console.log('Respuesta del caso de uso:', response);
        if (response.status === 200){
            return res.status(200).json({ status: 200, message: 'Estado actualizado correctamente.' });
        }
        if (response.status === 404) {
            return res.status(404).json({ status: 404, message: response.message });
        }
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}