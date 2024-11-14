import { Request, Response } from "express";
import { GetServicesUseCase } from "../../application/usecases/GetServicesUseCase";

export class GetServicesController {
    constructor(readonly getServicesUseCase: GetServicesUseCase) {}

    async run(req: Request, res: Response){
        try {
            req.body = {uuid: req.body.uuid};
            console.log(req.body);
            const response = await this.getServicesUseCase.run(req.body.uuid);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.send(error);
        }
    }
}