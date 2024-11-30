import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
    registerUserController, 
    activateUserController, 
    loginUserController, 
    logoutUserController, 
    saveProfileDataController, 
    getServicesController,
    searchSupplierController,
    getProfileController,
    getFiltersController,
    googleAuthController,
    searchSuppliersController,
    getDataUserController,
    getAllSuppliersController
} from '../dependencies';
import passport from 'passport';

const router = Router();

// Rutas públicas
router.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    registerUserController.run(req, res);
});

router.put('/:token/activate', (req: Request, res: Response) => {
    activateUserController.run(req, res);
});

router.post('/login', (req: Request, res: Response) => {
    loginUserController.run(req, res);
});

router.get('/google', (req: Request, res: Response) => {
    console.log("ruta auth/google", req.query.token);
    googleAuthController.run(req, res);
});

router.get('/auth/google/callback', passport.authenticate('google', { 
    successRedirect: '/home',
    failureRedirect: '/login' 
}));

router.post('/logout', (req: Request, res: Response) => {
    logoutUserController.run(req, res);
});

router.put('/profile/suplier', (req: Request, res: Response) => {
    saveProfileDataController.saveProfileData(req, res);
});
router.post('/all/suppliers', (req: Request, res: Response) => {
    getAllSuppliersController.run(req, res);
});


router.use(authMiddleware);


router.get('/get/data', (req: Request, res: Response) => {
    console.log('Ruta get data, req.body:', req.body);
    getDataUserController.run(req, res);
});

router.get('/get/services/:uuid', (req: Request, res: Response) => {
    getServicesController.run(req, res);
});

router.post('/services/ai', (req: Request, res: Response) => {
    searchSupplierController.run(req, res);
});

router.post('/profile/', (req: Request, res: Response) => {
    getProfileController.run(req, res);
});

router.post('/filters', (req: Request, res: Response) => {
    getFiltersController.run(req, res);
});

router.post('/suppliers', (req: Request, res: Response) => {
    console.log('Ruta suppliers, req.body:', req.body);
    searchSuppliersController.run(req, res);
});

export default router;
