import { Router, Request, Response } from 'express';
import { 
    createPostController,
    createCommentController,
    findCommentsController,
    findPostByTitleController,
    getAllPostController,
    geAllPostByIdController
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

//? all
router.get('/get/posts', (req: Request, res: Response) => {
    console.log('query', req.query);
    getAllPostController.run(req, res);
});

//? id
router.get('/get/posts/:id', (req: Request, res: Response) => {
    console.log('params', req.params);
    geAllPostByIdController.run(req, res);
});

router.get('/find/post', (req: Request, res: Response) => {
    console.log('query', req.query);
    findPostByTitleController.run(req, res);
});

export default router;
