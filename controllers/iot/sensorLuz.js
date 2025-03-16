const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'iluminacion';

exports.registrarLuz = async (req,res) => {
    const {idSalon, clase, foco, porcentaje} = req.body;

    if (!idSalon) {
        return res.status(400).json({message : 'El id del salon es necesario'})
    }
    if (!clase) {
        return res.status(400).json({message : 'El estado de la clase es necesario'})
    }
    if (!porcentaje) {
        return res.status(400).json({message : 'El porcentaje del sensor de luz es necesario'})
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const luzRegistro = {
            idSalon,
            clase,
            foco,
            porcentaje,
            fecha: new Date()
        };

        await collection.insertOne(luzRegistro);
        res.status(200).json({
            status: true,
            message: 'Registro insertado correctamente'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message : 'Error al registrar', 
            error
        })
    }
}


{/*{
    _id:ObjectId(123),
    idSalon: 1, //salon del registro (id)
    clase:1,    //si hay clase activa o no (1= si , 2= no)
    foco: 1,  //si esta el foco activo o no(1= activa, 0= inactiva)
    porcentaje:0,   //porcebntaje de luz que detecta el sensor (0 - 4095 del sensor)
    fecha:IsoDate,
} */}