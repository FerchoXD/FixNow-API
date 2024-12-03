import { GetAllPostByIdUseCase } from "../../application/usescase/GetAllPostByIdUseCase";
import { Response,Request } from "express";

export class GetAllPostByIdController {
    constructor(readonly usecase: GetAllPostByIdUseCase) { }

    async run(req:Request,res:Response): Promise<any> {
        const { id } = req.params;
        const userUuid = id;

        console.log('Controlador userUuid:', userUuid);

        if (!userUuid) {
            return res.status(400).send({
                message: 'Faltan campos obligatorios.',
            });
        }
        console.log('GetAllPostByIdController');
        const response = await this.usecase.execute(userUuid);

        if (!response || (Array.isArray(response) && response.length === 0)) {
            return res.status(400).send({
                message: 'No se encontraron resultados.',
            });
        }

        if (response.status === 400) {
            return res.status(400).send({
                status: 400,
                message: response.message,
            });
        }

        if (response.error === 500) {
            return res.status(500).send({
                message: 'Ocurrió un error en el servidor.',
                error: (response as Error).message || response,
            });
        }

        return res.status(200).send({response});

    }
}