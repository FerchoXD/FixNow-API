import { FindCommentsUseCase } from "../../application/usescase/FindCommentsUseCase";
import { Request, Response } from 'express';

export class FindCommentsController {
    constructor(readonly findCommentsUseCase:FindCommentsUseCase) { }
    async run(req:Request, res: Response): Promise<any>{
        try {
            const { postUuid } = req.body;
            const comments = await this.findCommentsUseCase.execute(postUuid);
            res.status(200).json(comments);
        } catch (error) {
            const errorMessage = (error as Error).message;
            res.status(500).json({ message: errorMessage });
        }
    }
}