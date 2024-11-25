import { Router, Request, Response } from 'express';
import { 
    sendMessageController
} from '../dependencies';
const router = Router();

router.post('/send', async (req: Request, res: Response) => {
    await sendMessageController.run(req, res);
});

export default router;
