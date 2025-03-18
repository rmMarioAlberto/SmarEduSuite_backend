require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moment = require('moment-timezone'); // Asegúrate de tener moment-timezone instalado
const app = express();
const PORT = process.env.PORT || 3000;

// Importar middlewares
const { convertToUTC, convertToLocalTime } = require('./middlewares/timezone');

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Uso del middleware para manejar zonas horarias
app.use(convertToUTC);
app.use(convertToLocalTime);

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
const crudClases = require('./routes/web/clasesRoutes');
const reportesweb = require('./routes/web/reporteRoutes');
const horarioMaestro = require('./routes/web/horarioMaestroRoutes');

// IoT
const tempRoutes = require('./routes/iot/tempRoutes');
const huellaRoutes = require('./routes/iot/huellaRoutes');
const luzRoutes = require('./routes/iot/luzRoutes');

// Movil
const authMovil = require('./routes/movil/authRoutes');

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
app.use('/web/crudClase', crudClases);
app.use('/web/reportes', reportesweb);
app.use('/web/horarioMaestro', horarioMaestro);

// IoT
app.use('/iot/temperatura', tempRoutes);
app.use('/iot/huella', huellaRoutes);
app.use('/iot/luz', luzRoutes);

// Movil
app.use('/movil', authMovil);

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
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

    // Mostrar la hora actual en UTC
    console.log('Hora actual en UTC:', moment().utc().format('YYYY-MM-DD HH:mm:ss'));

    // Mostrar la hora actual en la zona horaria local del servidor
    console.log('Hora actual en la zona horaria del servidor:', moment().format('YYYY-MM-DD HH:mm:ss'));

    // Mostrar la hora actual en la zona horaria de México
    console.log('Hora actual en México:', moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss'));
});