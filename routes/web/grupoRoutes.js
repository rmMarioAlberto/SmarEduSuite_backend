const express = require ('express')
const router = express.Router();
const grupoController = require('../../controllers/web/grupoController');

router.post('/grupos' , grupoController.getGrupos);
router.post('/grupoById', grupoController.getGrupoById);
router.post('/addGrupo', grupoController.addGrupo);
router.put('/updateGrupo' , grupoController.updateGrupo);
router.post('/searchGrupo', grupoController.searchGrupo);

module.exports = router;