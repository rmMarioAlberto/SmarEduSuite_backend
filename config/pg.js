const {Pool} = require("pg");
const client = require("./mongo");
require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    database : process.env.PGDATABASE,
    port: process.env.PGPORT,
    host : process.env.PGHOST,
    password : process.env.PGPASSWORD,
    ssl : {
        rejectUnauthorized : false
    }
});

pool.connect()
    .then(client => {
        console.log('PostgreSQL conectado')
        client.release();
    })
    .catch(err => console.error(`Error al conectar con PostgreSQL: ${err.message}`));

module.exports = pool;