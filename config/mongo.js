const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log('MongoDB conectado correctamente');
  })
  .catch(err => {
    console.log('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

module.exports = client;
