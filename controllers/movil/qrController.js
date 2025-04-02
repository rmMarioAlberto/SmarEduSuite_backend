const client = require('../../config/mongo');
const db = require('../../config/pg');
const dbName = 'SmartEduSuite';
const collectionName = 'listas';
const qr = require('../../config/qrServices');
const jwtControl = require('../../config/jwtConfig');
const moment = require('moment-timezone');

exports.scanQR = async (req, res) => {
    const { classId, startTime, validDuration, idUsuario, token, qrIdentifier } = req.body;

    // Validar los parámetros requeridos
    if (!classId || !startTime || !validDuration || !idUsuario || !token || !qrIdentifier) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    try {
        // Validar el token
        const results = await new Promise((resolve, reject) => {
            jwtControl.validateTokenMovil(idUsuario, token, (result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(new Error('Error al validar el token'));
                }
            });
        });

        if (!results.valid) {
            return res.status(401).json({ message: 'El token no es válido' });
        }

        // Validar la clase
        const classQuery = 'SELECT "idGrupo" FROM clase WHERE id = $1';
        const { rows: classRows } = await db.query(classQuery, [classId]);

        if (classRows.length === 0) {
            return res.status(400).json({ message: 'No se encontró la clase' });
        }

        const idGrupo = classRows[0].idGrupo;

        // Validar el usuario
        const userQuery = 'SELECT * FROM usuario WHERE "idGrupo" = $1 AND id = $2';
        const { rows: userRows } = await db.query(userQuery, [idGrupo, idUsuario]);

        if (userRows.length === 0) {
            return res.status(400).json({ message: 'El usuario no pertenece al grupo' });
        }

        // Convertir startTime a UTC desde la zona horaria de CDMX
        const startTimeCDMX = moment.tz(startTime, 'America/Mexico_City');
        const startTimeUTC = startTimeCDMX.clone().utc();

        // Validar el código QR
        const asistencia = qr.validateQRCode(startTimeUTC, validDuration);
        if (asistencia === -1) {
            return res.status(400).json({ message: 'Error en la validación del QR.' });
        }

        // Crear el objeto de pase de lista
        const paseLista = {
            claseId: classId,
            idUsuario: idUsuario,
            startTime: startTimeUTC.toISOString(),
            asistencia: asistencia,
            fecha: moment().tz('America/Mexico_City').utc().toDate(),
            qrIdentifier: qrIdentifier
        };

        // Conectar a la base de datos MongoDB
        const dbMongo = client.db(dbName);
        const collection = dbMongo.collection(collectionName);

        // Verificar si ya existe un registro para este identificador de QR
        const existingRecord = await collection.findOne({ qrIdentifier: qrIdentifier });

        if (existingRecord) {
            return res.status(409).json({ message: 'Ya se ha registrado la asistencia para esta clase.' });
        }

        // Insertar el nuevo registro
        const result = await collection.insertOne(paseLista);

        // Enviar respuesta exitosa con tipo de asistencia
        const tipoAsistencia = asistencia === 1 ? 'Asistencia' : 'Asistencia con falta';
        return res.status(201).json({ message: `Pase de lista registrado exitosamente. Tipo de asistencia: ${tipoAsistencia}`, result, tipoAsistencia });

    } catch (err) {
        console.error('Error al procesar el escaneo del QR:', err);
        return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};