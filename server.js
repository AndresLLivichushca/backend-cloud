// =======================
// Importación de módulos
// =======================
const express = require('express');         // Framework web para Node.js
const cors = require('cors');               // Permite habilitar CORS (cruce de orígenes)
const app = express();                      // Inicializamos la aplicación Express
const usuarioRoutes = require('./routes/usuarioRoutes'); // Rutas del módulo de usuarios
const path = require('path');               // Módulo para manejar rutas de archivos

// =============================
// Configuración de Middlewares
// =============================

// Habilita el análisis de datos en formato JSON que llegan en las solicitudes
app.use(express.json());

// Permite analizar datos enviados por formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Configura CORS para permitir peticiones desde otras IPs (como tu frontend en GCP)
app.use(cors({
  origin: ['http://34.71.197.78'],   // IP pública del frontend
  methods: ['GET', 'POST'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

// ============================================
// Servir archivos directamente desde Filestore
// ============================================
// Esto permite acceder a archivos guardados en /mnt/filestore a través del navegador.
// Ejemplo: http://<tu-servidor>/uploads/nombre-del-archivo.ext
app.use('/uploads', express.static('/home/xavi2000pi/uploads'));



// ==========================
// Rutas de la aplicación
// ==========================
// Todas las rutas de usuario empezarán con /api/usuarios
// Por ejemplo: POST /api/usuarios/create
app.use('/api/usuarios', usuarioRoutes);


// ==========================
// Iniciar el servidor
// ==========================
const PORT = process.env.PORT || 3000; // Usa el puerto 3000 por defecto o el que definas en el entorno

// Escuchar en '0.0.0.0' permite recibir peticiones desde cualquier IP (ideal en entornos de nube)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});


// ====================================
// Ruta simple para verificar el estado
// ====================================
// Puedes visitar: http://<tu-servidor>:3000/health
// Sirve para saber si el backend está corriendo correctamente
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
