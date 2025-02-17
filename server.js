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
const authRoutes = require('./routes/web/authRoutes');
const tempRoutes = require('./routes/iot/tempRoutes');

//cors and 
app.use(cors());
app.use(express.json());

//apis

            ///IoT
app.use('/web', authRoutes);

            ///web
app.use('/iot', tempRoutes);

            ///movil



//port
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));