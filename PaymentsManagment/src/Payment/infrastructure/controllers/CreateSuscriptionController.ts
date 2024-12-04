import { Request, Response } from 'express';
import { CreateSuscriptionUseCase } from '../../application/usescase/CreateSuscriptionUseCase';

export class CreateSuscriptionController {
    constructor(readonly usecase: CreateSuscriptionUseCase) {}

    public async run(req: Request, res: Response):Promise<any> {
        const {userUuid} = req.body;
        try {
            const response = await this.usecase.execute(userUuid);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({error: (error as Error).message});
        }
    }
}