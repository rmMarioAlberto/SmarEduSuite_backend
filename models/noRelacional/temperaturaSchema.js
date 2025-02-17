const mongoose = require('mongoose');

const temperaturaSchema = new mongoose.Schema({
    idSalon: { type: Number, required: true },
    clase: { type: Number, required: true },
    estado: { type: Number, required: true },
    temperatura: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temperatura', temperaturaSchema);