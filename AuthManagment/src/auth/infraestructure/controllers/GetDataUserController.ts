import { GetDataUserUseCase } from "../../application/usecases/GetDataUserUseCase";
import { Request, Response } from 'express';

export class GetDataUserController {
    constructor(readonly usecase: GetDataUserUseCase) { }

    async run(req: Request, res: Response): Promise<any> {
        const {userUuid} = req.body

        if (typeof userUuid !== 'string') {
            return res.status(400).json({ message: 'El UUID debe ser una cadena de texto válida.' });
        }

        if (!userUuid) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Falta el uuid del usuario."
            });
        }

        try {
            const response = await this.usecase.execute(userUuid);

        if (response.status === 404) {
            return res.status(404).json({
                error: "Not Found",
                message: "Usuario no encontrado."
            });
        }

        return res.status(response.status).json(response);
        } catch (error) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: (error as Error).message
            });
        }
    }
}   