import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../application/JWT/JWTService';

// Importar o definir la función extractToken
const extractToken = (authorizationHeader?: string): string | null => {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return null;
    }
    return authorizationHeader.split(' ')[1];
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;

    console.log('Token:', token);

    if (!token) {
        res.status(401).json({ message: 'No autorizado' });
        return; // Asegura que no continúa con `next()`
    }

    try {
        const user = JWTService.verifyToken(token);
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
