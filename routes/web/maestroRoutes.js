const express = require('express');
const router = express.Router();
const maestroCrud = require('../../controllers/web/maestroCrud');

router.post('/maestros', maestroCrud.getMaestro);
router.get('/maestroById', maestroCrud.getMaestroById);
router.post('/addMaestro', maestroCrud.addMaestro);
router.put('/updateMaestro', maestroCrud.updateMaestro);
router.get('/findMaestro', maestroCrud.searchMaestro)


module.exports = router;
