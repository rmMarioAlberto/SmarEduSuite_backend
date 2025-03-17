const db = require('../../config/pg');
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'puerta';
const jwtControl = require('../../config/jwtConfig')

exports.getHorarioMaestro = async (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, async (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const dia = getDayOfWeek();

        try {
            const query = 'SELECT * FROM clase WHERE "idUsuarioMaestro" = $1 AND dia = $2;';
            const { rows } = await db.query(query, [idUsuario, dia]);

            res.status(200).json({ clases: rows });
        } catch (err) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
};


exports.getClasesActivas = async (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, async (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        try {
            const collection = client.db(dbName).collection(collectionName);

            // Convertir idUsuario a un número entero
            const idUsuarioInt = parseInt(idUsuario, 10);

            const activeClasses = await collection.find({
                estado: 1,
                idMaestro: idUsuarioInt
            }).toArray();

            res.status(200).json({ clasesActivas: activeClasses });
        } catch (err) {
            console.error('Error en la consulta de clases activas:', err);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
};


const getDayOfWeek = () => {
    const now = new Date();
    return (now.getDay() + 6) % 7 + 1; 
};