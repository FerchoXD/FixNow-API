import { Router, Request, Response } from 'express';
import { 
    createServiceHistoryController,
    createSupplierHistoryController,
} from '../dependencies';
const router = Router();

router.post('/create/service', (req: Request, res: Response) => {
    createServiceHistoryController.run(res, req);
});

router.post('/history/supplier', (req: Request, res: Response) => {
    console.log(req.body);
    createSupplierHistoryController.run(req, res);
});

export default router;
