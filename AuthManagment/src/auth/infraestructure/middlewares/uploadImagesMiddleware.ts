import multer from 'multer';

export const uploadMiddleware = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Formato de archivo no permitido. Solo JPG, JPEG y PNG son aceptados.'));
        }
        cb(null, true);
    },
}).single('File'); // Aquí especificamos el campo "File"
