import { Router, Request, Response, NextFunction } from 'express';
import { registerUserController, activateUserController, loginUserController, logoutUserController } from '../dependencies';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    registerUserController.run(req, res);
});

router.put('/:token/activate', (req: Request, res: Response) => {
    activateUserController.run(req, res);
});

router.post('/auth/login', (req: Request, res: Response) => {
    loginUserController.run(req, res);
});

router.post('/auth/logout', (req: Request, res: Response) => {
    logoutUserController.run(req, res);
});

export default router;
