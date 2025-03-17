const express = require ('express')
const router = express.Router();
const maestroHorarioController = require('../../controllers/web/maestroHorarioController');

router.post('/getHorarioDia', maestroHorarioController.getHorarioMaestro);
router.post('/getClasesActivas', maestroHorarioController.getClasesActivas);

module.exports = router;