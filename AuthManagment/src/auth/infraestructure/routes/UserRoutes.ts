import { Router, Request, Response } from 'express';
import { 
    registerUserController, 
    activateUserController, 
    loginUserController, 
    logoutUserController, 
    saveProfileDataController, 
    getServicesController,
    searchSupplierController
} from '../dependencies';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    registerUserController.run(req, res);
});

router.put('/:token/activate', (req: Request, res: Response) => {
    activateUserController.run(req, res);
});

router.post('/auth/login', (req: Request, res: Response) => {
    loginUserController.run(req, res);
});

router.post('/auth/logout', (req: Request, res: Response) => {
    logoutUserController.run(req, res);
});

router.put('/profile/suplier', (req: Request, res: Response) => {
    saveProfileDataController.saveProfileData(req, res);
});

router.get('/get/services/:uuid', (req: Request, res: Response) => {
    getServicesController.run(req, res);
});

router.post('/services/ai', (req: Request, res: Response) => {
    searchSupplierController.run(req, res);
});


router.put('/profile/customer', (req: Request, res: Response) => {
    //TODO: Implementar el perfil de cliente
    throw new Error('Not implemented');
});

router.get('/profile/:uuid', (req: Request, res: Response) => {
    //TODO: Implementar la obtención de un perfil
    throw new Error('Not implemented');
});


router.get('/get/filters', (req: Request, res: Response) => {
    //TODO: Implementar la obtención de los filtros
    throw new Error('Not implemented');
});


export default router;
