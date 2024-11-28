import { Router, Request, Response } from 'express';
import {sendMessageController} from '../dependencies';

const router = Router();

// Obtener historial de mensajes entre dos usuarios
router.post('/:userId/:recipientId',(req: Request, res: Response) => {
    console.log('GET /chat/:userId/:recipientId');
    sendMessageController.run(req,res);
});

export default router;
