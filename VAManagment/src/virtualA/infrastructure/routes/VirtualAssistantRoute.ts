import { Router, Request, Response } from 'express';
import { 
    recomendationChatController,
} from '../dependencies';
const router = Router();

router.post('/recomendation', (req: Request, res: Response) => {
    recomendationChatController.run(req, res);
});


export default router;
