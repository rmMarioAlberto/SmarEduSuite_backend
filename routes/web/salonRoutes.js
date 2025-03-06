const express = require('express');
const router = express.Router();
const salonesCrud = require('../../controllers/web/salonController')

router.post('/salones', salonesCrud.getSalon);
router.post('/salonById', salonesCrud.getSalonById);
router.post('/addSalon', salonesCrud.addSalon);
router.put('/updateSalon', salonesCrud.updateSalon);
router.post('/searchSalon' , salonesCrud.searchSalon);

module.exports = router;