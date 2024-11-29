import { Router, Request, Response } from 'express';
import { 
    createServiceHistoryController,
    createSupplierHistoryController,
} from '../dependencies';
const router = Router();

router.post('/create/service', (req: Request, res: Response) => {
    console.log("ruta",req.body);
    createServiceHistoryController.run(res, req);
});

router.post('/get/history', (req: Request, res: Response) => {
    console.log("ruta",req.body);
    createSupplierHistoryController.run(req, res);
});

export default router;
