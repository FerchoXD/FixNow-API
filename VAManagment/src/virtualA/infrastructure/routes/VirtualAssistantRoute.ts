import { Router, Request, Response } from 'express';
import { 
    recomendationChatController,
    getChatController
} from '../dependencies';
const router = Router();

router.post('/recomendation', (req: Request, res: Response) => {
    recomendationChatController.run(req, res);
});

router.post('/get/chat', (req: Request, res: Response) => {
    getChatController.run(req, res);
});

export default router;
