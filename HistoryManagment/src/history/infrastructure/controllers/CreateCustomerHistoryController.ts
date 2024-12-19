import { Response, Request } from "express";
import { CreateCustomerHistoryUseCase } from "../../application/usescase/CreateCustomerHistoryUseCase";

export class CreateCustomerHistoryController {
    constructor(readonly useCase: CreateCustomerHistoryUseCase) { }

    async run(req: Request, res: Response): Promise<any> {
        console.log('CreateCustomerHistoryController');
        const { customerUuid,} = req.body;
        const result = await this.useCase.execute(customerUuid);
        return res.json(result);
    }
}