const Pool = require("pg").Pool;
require("dotenv/config");

const pool = new Pool({
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: process.env.port
});

module.exports = pool;