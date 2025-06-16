// =========================================
// Importación de módulos y configuración
// =========================================
const express = require('express');
const router = express.Router(); // Usamos el enrutador de Express para modularizar rutas
const usuarioController = require('../controllers/usuarioController'); // Importamos el controlador con la lógica
const upload = require('../multerConfig'); // Importamos la configuración de Multer para subir archivos


// =========================================
// Ruta: Crear un nuevo usuario con archivo
// =========================================
// POST /api/usuarios/create
// Esta ruta permite crear un usuario y subir un archivo (como PDF, imagen, etc.)
// Multer se encarga de procesar el archivo que se sube desde el formulario HTML o Angular
// ACEPTAR TAMBIÉN /api/usuarios
router.post('/create', upload.single('file'), usuarioController.createUsuario);
router.post('/', upload.single('file'), usuarioController.createUsuario);



// ================================================
// Ruta: Descargar el archivo asociado a un usuario
// ================================================
// GET /api/usuarios/download/:id
// Busca el archivo asociado al usuario con el ID que llega por la URL y lo devuelve como descarga
router.get('/download/:id', usuarioController.downloadFile);


// Exportamos las rutas para que puedan usarse en app.js
module.exports = router;
