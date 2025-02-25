//dependencias
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Requiere las conexiones a las bases de datos
require('./config/mongo');
require('./config/pg');

//requires routes

//web
const authRoutes = require('./routes/web/authRoutes');
const crudMaterias = require('./routes/web/materiaRoutes')
const crudMaestro = require('./routes/web/maestroRoutes')
const crudCarrera = require('./routes/web/carreraRoutes')

//iot
const tempRoutes = require('./routes/iot/tempRoutes');

//cors and 
app.use(cors());
app.use(express.json());

//apis

            ///web
app.use('/web', authRoutes);
app.use('/web/crudMaterias', crudMaterias)
app.use('/web/crudMaestro', crudMaestro)
app.use('web/crudCarrera', crudCarrera)

            ///iot
app.use('/iot', tempRoutes);

            ///movil



//port
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));