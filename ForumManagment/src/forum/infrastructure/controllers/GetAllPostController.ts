import { GetAllPostUseCase } from "../../application/usescase/GetAllPostUseCase";
import { Response, Request } from "express";

export class GetAllPostController {
    constructor(readonly useCase: GetAllPostUseCase) { }

    async run(req: Request, res: Response): Promise<any> {
        console.log('GetAllPostController');
        const result = await this.useCase.execute();
        if (!result || (Array.isArray(result) && result.length === 0)) {
            return res.status(400).send({
                message: 'No se encontraron resultados.',
            });
        }
        return res.status(200).json(result);

    }   
}