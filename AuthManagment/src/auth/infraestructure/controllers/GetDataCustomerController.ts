import { GetDataCustomerUseCase } from "../../application/usecases/GetDataCustomerUseCase";
import { UserInterface } from "../../domain/repositories/UserInterface";
import { Response,Request } from "express";

export class GetDataCustomerController {
    constructor(readonly usecase: GetDataCustomerUseCase) { }

    async run(req: Request, res: Response) {
        try {
            const { userUuid } = req.params;

            if (!userUuid) {
                res.status(400).json({ message: 'Se requiere el uuid' });
                return;
            }

            const response = await this.usecase.execute(userUuid);
            res.status(200).json(response);
        } catch (error:any) {
            res.status(400).json({ message: error.message });
        }
    }
}