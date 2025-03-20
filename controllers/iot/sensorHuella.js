const db = require('../../config/pg');
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'puerta';

const { ObjectId } = require('mongodb');
const { generateQRCode } = require('../../config/qrServices');
const moment = require('moment-timezone');

exports.startClass = async (req, res) => {
    const { huella, idSalon } = req.body;

    if (!huella || !idSalon) {
        return res.status(400).json({ message: "La huella y el ID del salón son necesarios" });
    }

    try {
        const salonQuery = 'SELECT * FROM salon WHERE id = $1';
        const salonResult = await db.query(salonQuery, [idSalon]);

        if (salonResult.rowCount === 0) {
            return res.status(404).json({ message: 'Salón no encontrado' });
        }

        // Obtener la hora actual en UTC
        const nowUTC = moment.utc();

        // Convertir a la hora de México para la lógica de negocio
        const nowMexico = nowUTC.clone().tz('America/Mexico_City');

        const currentHour = nowMexico.format('HH:mm:ss'); // Hora actual en formato de 24 horas
        const currentDay = (nowMexico.day() + 6) % 7 + 1; // Ajustar el día de la semana

        const classQuery = `
            SELECT * FROM clase 
            WHERE "idSalon" = $1 
            AND $2::time BETWEEN inicio AND final 
            AND dia = $3
        `;
        const classResult = await db.query(classQuery, [idSalon, currentHour, currentDay]);

        if (classResult.rowCount === 0) {
            return res.status(404).json({ message: `No hay clase activa en este momento: ${currentHour} ; ${currentDay}` });
        }

        const clase = classResult.rows[0];

        const userQuery = 'SELECT * FROM usuario WHERE huella = $1 AND id = $2';
        const userResult = await db.query(userQuery, [huella, clase.idUsuarioMaestro]);

        if (userResult.rowCount === 0) {
            return res.status(401).json({ message: 'Huella no corresponde al maestro de la clase' });
        }

        // Generar el código QR
        const validDuration = 10; // Duración válida en minutos
        const qrCodeBase64 = await generateQRCode(clase.id, nowUTC.toISOString(), validDuration, clase.idUsuarioMaestro);

        const newClass = {
            estado: 1,
            fechaStart: nowUTC.toDate(), // Almacenar en UTC
            fechaEnd: null,
            idClase: clase.id,
            idSalon: idSalon,
            qrCode: qrCodeBase64,
            idMaestro: clase.idUsuarioMaestro,
            idGrupo : clase.idGrupo
        };


        const collection = client.db(dbName).collection(collectionName);
        const insertResult = await collection.insertOne(newClass);

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

        const userQuery = 'SELECT * FROM usuario WHERE huella = $1 AND id = $2';
        const userResult = await db.query(userQuery, [huella, clase.idUsuarioMaestro]);

        if (userResult.rowCount === 0) {
            return res.status(401).json({ message: 'Huella no corresponde al maestro de la clase' });
        }

        // Actualizar el estado de la clase a finalizada
        const updateClass = {
            estado: 0,
            fechaEnd: moment.utc().toDate() // Almacenar en UTC
        };

        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateClass });

        res.status(200).json({ message: 'Clase finalizada' });
    } catch (err) {
        res.status(500).json({ message: `Error en el servidor: ${err.message}` });
    }
};

exports.updateHuella = (req, res) => {
    const { idMaestro, idhuella } = req.body;

    if (!idMaestro) {
        return res.status(400).json({ message: 'El ID del maestro es necesario' });
    }

    if (!idhuella) {
        return res.status(400).json({ message: 'El ID de la huella es necesario' });
    }

    const query = 'UPDATE usuario SET huella = $1 WHERE id = $2 AND tipo = 2';

    db.query(query, [idhuella, idMaestro], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor', err });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontró el maestro o no se pudo actualizar la huella' });
        }

        // Se actualizó al menos un registro
        return res.status(200).json({ message: 'Huella registrada correctamente' });
    });
};