const express = require('express')
const routes = express.Router();
const clasesController = require('../../controllers/movil/clasesController');

routes.post('/horarioMaestro', clasesController.getHorarioMaestro)
routes.post('/clasesActivasMaestro', clasesController.getClasesActivasMaestro);
routes.post('/horarioAlumno', clasesController.getHorarioDiaAlumno);
routes.post('/clasesActivasAlumno', clasesController.getClasesActivasDiaAlumno)


module.exports = routes;