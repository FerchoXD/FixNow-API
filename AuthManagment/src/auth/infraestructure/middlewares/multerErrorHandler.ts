import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const multerErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ error: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10MB.' });
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            res.status(400).json({ error: 'Demasiados archivos. El límite es 5.' });
        }else {
            res.status(400).json({ error: `Error al subir el archivo: ${err.message}` });
        }
    } else if (err instanceof Error && err.message === 'Formato de archivo no permitido. Solo JPG, JPEG y PNG son aceptados.') {
        // Error lanzado por el fileFilter
        res.status(400).json({ error: err.message });
    } else {
        // Otros errores no manejados
        res.status(500).json({ error: 'Ocurrió un error inesperado.' });
    }
};
