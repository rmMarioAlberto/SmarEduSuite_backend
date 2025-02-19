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
//movil
const authRoutesMovil = require('./routes/movil/authRoutes')
//web
const authRoutesWeb = require('./routes/web/authRoutes');
const materiaRoutes = require('./routes/web/materiaRoutes');
//iot
const tempRoutes = require('./routes/iot/tempRoutes');


//cors and 
app.use(cors());
app.use(express.json());

//apis

///IoT
app.use('/iot', tempRoutes);

///web
app.use('/web/auth', authRoutesWeb);
app.use('/web/materias', materiaRoutes);

///movil
app.use('/movil', authRoutesMovil);


//port
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));