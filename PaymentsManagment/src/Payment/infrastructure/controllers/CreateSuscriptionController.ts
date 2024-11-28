import { Request, Response } from 'express';

export class CreateSuscriptionController {
    constructor(private createSuscriptionUseCase: any) {}

    public async run(req: Request, res: Response):Promise<any> {
        const {userUuid} = req.body;
        try {
            const response = await this.createSuscriptionUseCase.run(userUuid);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({error: (error as Error).message});
        }
    }
}