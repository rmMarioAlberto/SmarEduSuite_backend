// Dependencias
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Requiere las conexiones a las bases de datos
require('./config/mongo');
require('./config/pg');

// Requires de rutas

// Web
const authRoutes = require('./routes/web/authRoutes');
const crudMaterias = require('./routes/web/materiaRoutes');
const crudMaestro = require('./routes/web/maestroRoutes');
const crudCarrera = require('./routes/web/carreraRoutes');
const crudGrupo = require('./routes/web/grupoRoutes');
const crudSalones = require("./routes/web/salonRoutes");
const graficas = require('./routes/web/graficaRoutes');
const crudAlumno = require('./routes/web/alumnoRoutes');

// IoT
const tempRoutes = require('./routes/iot/tempRoutes');
const huellaRoutes = require('./routes/iot/huellaRoutes');

//movil
const authMovil = require('./routes/movil/authRoutes')

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Permite solicitudes desde el frontend (o todas en desarrollo)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API

// Web
app.use('/web', authRoutes);
app.use('/web/crudMaterias', crudMaterias);
app.use('/web/crudMaestro', crudMaestro);
app.use('/web/crudCarrera', crudCarrera);
app.use('/web/crudGrupo', crudGrupo);
app.use('/web/crudSalon', crudSalones);
app.use('/web/graficas', graficas);
app.use('/web/crudAlumno', crudAlumno);

// IoT
app.use('/iot/temperatura', tempRoutes);
app.use('/iot/huella', huellaRoutes);

//movil
app.use('/movil', authMovil)

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor funcionando correctamente' });
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprime el error en la consola
    res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});