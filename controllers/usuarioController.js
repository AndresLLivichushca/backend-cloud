// Importación de módulos necesarios
const fs = require('fs');               // Módulo para trabajar con el sistema de archivos
const path = require('path');           // Módulo para manejar rutas de archivos
const { Pool } = require('pg');         // Módulo para conectarse y hacer consultas a PostgreSQL

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',            // Usuario de la base de datos
  host: '10.128.0.6',          // Dirección IP interna de la base de datos (en GCP u otra red privada)
  database: 'adminuser_db',    // Nombre de la base de datos
  password: '5432',            // Contraseña del usuario (este valor parece incorrecto, usualmente es diferente al puerto)
  port: 5432,                  // Puerto de conexión (5432 es el estándar para PostgreSQL)
});

// Ruta base donde se guardarán los archivos en el sistema (montaje del Filestore)
const FILESTORE_BASE_PATH = '/mnt/filestore';


// ==========================
// Función para crear un usuario
// ==========================

exports.createUsuario = async (req, res) => {
  try {
    // Extraemos los datos enviados en el cuerpo de la petición
    const { nombre, apellido, direccion } = req.body;

    // Si se sube un archivo, se construye su ruta absoluta usando Filestore
    const filePath = req.file ? path.join(FILESTORE_BASE_PATH, req.file.filename) : null;

    // Consulta SQL para insertar un nuevo usuario en la tabla "usuarios"
    const query = `
      INSERT INTO usuarios (nombre, apellido, direccion, file_path)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    // Valores que se pasarán a la consulta
    const values = [nombre, apellido, direccion, filePath];

    // Ejecutamos la consulta con los valores indicados
    const result = await pool.query(query, values);

    // Respondemos al cliente con el nuevo usuario creado
    res.status(201).json({
      message: 'Usuario creado con éxito',
      usuario: result.rows[0],
    });
  } catch (error) {
    // Si hay algún error, lo mostramos en consola y respondemos con error 500
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};


// ===============================
// Función para descargar el archivo de un usuario
// ===============================

exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;  // Obtenemos el ID del usuario desde los parámetros de la URL

    // Consultamos en la base de datos la ruta del archivo asociada al ID del usuario
    const query = 'SELECT file_path FROM usuarios WHERE id = $1;';
    const result = await pool.query(query, [id]);

    // Si no se encuentra el usuario o no tiene archivo asignado
    if (result.rows.length === 0 || !result.rows[0].file_path) {
      return res.status(404).json({ message: 'Archivo no encontrado en la base de datos' });
    }

    const filePath = result.rows[0].file_path; // Obtenemos la ruta absoluta del archivo

    console.log(`Ruta generada para el archivo: ${filePath}`);

    // Validamos si el archivo existe físicamente en el sistema de archivos
    if (!fs.existsSync(filePath)) {
      console.error(`Archivo no encontrado en el servidor: ${filePath}`);
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }

    // Enviamos el archivo al cliente para su descarga
    res.download(filePath, path.basename(filePath)); // El segundo parámetro define el nombre con el que se descargará
  } catch (error) {
    // Si ocurre un error al intentar descargar, lo mostramos en consola
    console.error('Error al descargar archivo:', error);
    res.status(500).json({ message: 'Error al descargar archivo', error });
  }
};
