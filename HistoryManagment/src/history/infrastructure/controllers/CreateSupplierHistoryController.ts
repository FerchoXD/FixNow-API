import { Request, Response } from 'express';
import { CreateSupplierHistoryUseCase } from '../../application/usescase/CreateSupplierHistoryUseCase';

export class CreateSupplierHistoryController {
  constructor(private createSupplierHistoryUseCase: CreateSupplierHistoryUseCase) {}

  async run(req: Request, res: Response) {
    const { supplierUuid } = req.body;

    console.log('Controlador userUuid:', supplierUuid);

    if (!supplierUuid) {
      return res.status(400).json({ error: 'UUID es requerido' });
  }

    try {
      const response = await this.createSupplierHistoryUseCase.execute(supplierUuid);

      console.log('Respuesta del caso de uso:', response.status);

      if (response.status === 404) {
        return res.status(404).json({ 
          status: 404,
          message: response.message 
        });
      }

      console.log("pase");

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en CreateSupplierHistoryController:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
