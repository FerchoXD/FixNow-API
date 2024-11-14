import { GetProfileUseCase } from "../../application/usecases/GetGetProfileUseCase";
import { Request, Response } from 'express';

export class GetProfileController {
    private getProfileUseCase: GetProfileUseCase;

    constructor(getProfileUseCase: GetProfileUseCase) {
        this.getProfileUseCase = getProfileUseCase;
    }

    async run(req: Request, res: Response) {
        const { uuid } = req.body;

        console.log('Buscando perfil de usuario con el id:', uuid);

        if (!uuid) {
            return res.status(400).json({ error: 'El id del usuario es requerido' });
        }

        try {
            const user = await this.getProfileUseCase.execute(uuid);
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error al buscar perfil de usuario:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}