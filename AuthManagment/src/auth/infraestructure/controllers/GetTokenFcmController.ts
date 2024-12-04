import { Request, Response } from 'express';
import { TokenFcmUseCase } from '../../application/usecases/TokenFcmUseCase';

export class TokenFcmController {
    constructor(readonly usecase: TokenFcmUseCase) {
    }

    async run(req: Request, res: Response): Promise<any> {
        try {
            const { tokenfcm, userUuid } = req.body;
            console.log('TokenFcmController.run, token:', tokenfcm, 'userUuid:', userUuid);

            if (!tokenfcm || !userUuid) {
                res.status(400).send('Faltan datos en la petición');
                return;
            }

            const response = await this.usecase.execute(userUuid, tokenfcm);
            res.status(201).send(response);
        } catch (error) {
            console.error('Error en TokenFcmController:', error);
            res.status(500).send('Error guardando el token');
        }
    }
}