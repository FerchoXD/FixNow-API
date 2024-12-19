import { GetChatUseCase } from "../../application/usescase/GetChatUseCase";
import { Request, Response } from 'express';

export class GetChatController {
    constructor(readonly useCase: GetChatUseCase) { }

    async run(req: Request, res: Response): Promise<any> {
        const { userUuid } = req.body;
        const response = await this.useCase.execute(userUuid);
        res.json(response);
    }
}