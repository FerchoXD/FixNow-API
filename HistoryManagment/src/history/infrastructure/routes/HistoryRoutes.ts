import { Router, Request, Response } from 'express';
import { 
    createServiceHistoryController,
    createSupplierHistoryController,
    createCustomerHistoryController,
    changeStatusController
} from '../dependencies';
const router = Router();

//* Rutas para crear un historial de servicios {userUuid, supplierUuid, title, description, agreedPrice, agreedDate}
router.post('/create/service', (req: Request, res: Response) => {
    console.log("ruta",req.body);
    createServiceHistoryController.run(res, req);
});

//* Rutas para obtener el historial de un proveedor {supplierUuid}
router.post('/get/history/supplier', (req: Request, res: Response) => {
    console.log("ruta",req.body);
    createSupplierHistoryController.run(req, res);
});

//* Rutas para obtener el historial de un cliente {userUuid}
router.post('/get/history/customer', (req: Request, res: Response) => {
    console.log("ruta",req.body);
    createCustomerHistoryController.run(req, res);
});

//
router.post('/status', (req: Request, res: Response) => {
    changeStatusController.run(req, res);
});

export default router;
