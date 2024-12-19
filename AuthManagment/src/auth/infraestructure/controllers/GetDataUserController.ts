import { GetDataUserUseCase } from "../../application/usecases/GetDataUserUseCase";
import { Request, Response } from 'express';

export class GetDataUserController {
    constructor(readonly usecase: GetDataUserUseCase) { }

    async run(req: Request, res: Response): Promise<any> {
        try {
            const user = (req as any).user; // Datos decodificados del token
            if (!user) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }

            // Opcional: Obtener información adicional del usuario desde el repositorio
            const userData = await this.usecase.execute(user.userId);
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
        }
    }
}   