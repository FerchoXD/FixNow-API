import multer from 'multer';

export const uploadMiddleware = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // Tamaño máximo por archivo: 10MB
    // fileFilter: (req, file, cb) => {
    //     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    //     if (!allowedMimeTypes.includes(file.mimetype)) {
    //         return cb(new Error('Formato de archivo no permitido. Solo JPG, JPEG y PNG son aceptados.'));
    //     }
    //     cb(null, true);
    // },
}).array('File', 5);