const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento en Filestore
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Simular el filestore
    const uploadPath = '/home/xavi2000pi/uploads';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Renombrar archivo con un timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Crear el middleware Multer con la configuración
const upload = multer({ storage });

module.exports = upload;
