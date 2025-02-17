const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'temperatura';

exports.registrarTemperatura = async (req, res) => {
    const { idSalon, clase, estado, temperatura } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const nuevaTemperatura = {
            idSalon,
            clase,
            estado,
            temperatura,
            fecha: new Date()
        };

        await collection.insertOne(nuevaTemperatura);
        console.log('Temperatura guardada:', nuevaTemperatura);
        res.status(201).json({ message: 'Temperatura registrada exitosamente' });
    } catch (error) {
        console.error('Error al guardar la temperatura:', error);
        res.status(500).json({ message: 'Error al registrar la temperatura', error });
    }
};