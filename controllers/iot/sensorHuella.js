//relacional
const db = require('../../config/pg');
//no relacional
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'puertas';

exports.startClass = (req, res) => {
    const {idSalon, huella} = req.body

    if (!idSalon) {
        res.status(400).json({message: 'El id del salon es requerido'});
    } 
    if(!huella) {
        res.status(400).json({message: 'La huella es requerida'});
    }

    const query = 'SELECT * FROM usuario WHERE "huella" = $1';
    db.query(query, [huella], (err, restult) => {
        
        if(err){
            res.status(500).json({message : 'Error en el servidor (1)'})
        }

        if(restult.rows.length === 0){
            res.status(401).json({message : 'Usuario no encontrado (1)'})
        }

        const user = restult.rows[0];

        if(user.status == 0){
            res.status(401).json({message : 'Usuario desactivado (1)'})
        }

        const query2 = 'SELECT * FROM salon '

    })
}

exports.endClass = (req, res) => {
    const {idSalon, huella, idClase} = req.body;

    if (!idsalon) {
        res.status(500).json({message: 'el numero del salon es requerido'})
    }
}