const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'temperatura';

exports.registrarTemperatura = async (req, res) => {
    const { idSalon, clase, ventana, temperatura } = req.body;

    if (!idSalon) {
        return res.status(400).json({message : 'El id del salon es necesario'})
    }
    if (!clase) {
        return res.status(400).json({message : 'El estado de la clase es necesario'})
    }
    if (!temperatura) {
        return res.status(400).json({message : 'La temperatura del sensor es necesario'})
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const nuevaTemperatura = {
            idSalon,
            clase,
            ventana,
            temperatura,
            fecha: new Date()
        };

        await collection.insertOne(nuevaTemperatura);
        res.status(201).json({ message: 'Temperatura registrada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la temperatura', error });
    }
};
