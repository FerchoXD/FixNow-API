import { Request, Response } from 'express';
import { CreateSupplierHistoryUseCase } from '../../application/usescase/CreateSupplierHistoryUseCase';

export class CreateSupplierHistoryController {
  constructor(private createSupplierHistoryUseCase: CreateSupplierHistoryUseCase) {}

  async run(req: Request, res: Response) {
    const { userUuid } = req.body;

    console.log('userUuid:', userUuid);

    if (!userUuid) {
      res.status(400).json({ message: 'User UUID is required' });
      return;
    }

    try {
      const response = await this.createSupplierHistoryUseCase.execute(userUuid);

      if (response.status === 404) {
        res.status(404).json({ 
          status: 404,
          message: response.message 
        });
        return;
      }

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en CreateSupplierHistoryController:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}
