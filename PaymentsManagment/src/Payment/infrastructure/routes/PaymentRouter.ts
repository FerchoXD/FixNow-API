import { Router, Request, Response } from 'express';
import { 
    createSuscriptionController,
} from '../dependencies';
const router = Router();

router.post('/create/suscription', (req: Request, res: Response) => {
    createSuscriptionController.run(req ,res );
});

router.get('/success', (req: Request, res: Response) => {
    const paymentInfo = req.query;
    console.log('Pago exitoso:', paymentInfo);
});

router.get('/failure', (req: Request, res: Response) => {
    console.log('Pago fallido');
});

router.get('/pending', (req: Request, res: Response) => {
    console.log('Pago pendiente');
});

export default router;
