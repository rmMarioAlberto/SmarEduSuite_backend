const db = require('../../config/pg');
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'puerta';

const { ObjectId } = require('mongodb'); 

exports.startClass = async (req, res) => {
    const { huella, idSalon } = req.body;

    if (!huella || !idSalon) {
        return res.status(400).json({ message: "La huella y el ID del salón son necesarios" });
    }

    try {
        // Verificar que el salón existe
        const salonQuery = 'SELECT * FROM salon WHERE id = $1';
        const salonResult = await db.query(salonQuery, [idSalon]);

        if (salonResult.rowCount === 0) {
            return res.status(404).json({ message: 'Salón no encontrado' });
        }

        // Obtener la hora actual en formato HH:MM:SS
        const now = new Date();
        const currentHour = now.toTimeString().split(' ')[0]; // Obtiene "HH:MM:SS"

        // Obtener el día de la semana ajustado
        const currentDay = (now.getDay() + 6) % 7 + 1; // Ajustar para que 1 sea lunes y 7 sea domingo

        // Verificar si hay una clase activa en el salón
        const classQuery = `
            SELECT * FROM clase 
            WHERE "idSalon" = $1 
            AND $2::time BETWEEN inicio AND final 
            AND dia = $3
        `;
        const classResult = await db.query(classQuery, [idSalon, currentHour, currentDay]);

        if (classResult.rowCount === 0) {
            return res.status(404).json({ message: `No hay clase activa en este momento: ${currentHour}` });
        }

        const clase = classResult.rows[0];

        // Verificar que la huella corresponde al maestro de la clase
        const userQuery = 'SELECT * FROM usuario WHERE huella = $1 AND id = $2';
        const userResult = await db.query(userQuery, [huella, clase.idUsuarioMaestro]);

        if (userResult.rowCount === 0) {
            return res.status(401).json({ message: 'Huella no corresponde al maestro de la clase' });
        }

        // Insertar un nuevo documento en MongoDB
        const newClass = {
            estado: 1,
            fechaStart: now,
            fechaEnd: null,
            idClase: clase.id,
            idSalon: idSalon
        };

        const collection = client.db(dbName).collection(collectionName);
        const insertResult = await collection.insertOne(newClass);

        // Devolver el ObjectId del documento insertado
        res.status(201).json({ message: 'Clase iniciada', id: insertResult.insertedId });
    } catch (err) {
        res.status(500).json({ message: `Error en el servidor: ${err.message}` });
    }
};


exports.endClass = async (req, res) => {
    const { id, huella } = req.body;

    if (!id || !huella) {
        return res.status(400).json({ message: "El ID del documento y la huella son necesarios" });
    }

    try {
        // Verificar que el documento existe en MongoDB
        const collection = client.db(dbName).collection(collectionName);
        const classDocument = await collection.findOne({ _id: new ObjectId(id) });

        if (!classDocument) {
            return res.status(404).json({ message: 'Clase no encontrada' });
        }

        // Obtener la información de la clase desde PostgreSQL usando el idClase del documento
        const classQuery = 'SELECT * FROM clase WHERE id = $1';
        const classResult = await db.query(classQuery, [classDocument.idClase]);

        if (classResult.rowCount === 0) {
            return res.status(404).json({ message: 'Clase no encontrada en la base de datos' });
        }

        const clase = classResult.rows[0];

        // Verificar que la huella corresponde al maestro de la clase
        const userQuery = 'SELECT * FROM usuario WHERE huella = $1 AND id = $2';
        const userResult = await db.query(userQuery, [huella, clase.idUsuarioMaestro]);

        if (userResult.rowCount === 0) {
            return res.status(401).json({ message: 'Huella no corresponde al maestro de la clase' });
        }

        // Actualizar el documento en MongoDB para finalizar la clase
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { estado: 0, fechaEnd: new Date() } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: 'Clase no encontrada para actualizar' });
        }

        res.status(200).json({ message: 'Clase finalizada' });
    } catch (err) {
        res.status(500).json({ message: `Error en el servidor: ${err.message}` });
    }
};