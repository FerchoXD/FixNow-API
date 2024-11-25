import { Router, Request, Response } from 'express';
import { 
    createPostController,
    createCommentController,
    findCommentsController,
    findPostByTitleController
} from '../dependencies';
const router = Router();

router.post('/create/post', (req: Request, res: Response) => {
    createPostController.run(req, res);
});

router.post('/create/comment', (req: Request, res: Response) => {
    createCommentController.run(req, res);
});

router.post('/find/comments', (req: Request, res: Response) => {
    findCommentsController.run(req, res);
});

router.get('/find/post', (req: Request, res: Response) => {
    console.log('query', req.query);
    findPostByTitleController.run(req, res);
});

export default router;
