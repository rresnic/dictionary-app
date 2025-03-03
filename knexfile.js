require('dotenv').config();
const {PGCONNECTIONURI} = process.env;

module.exports = {
    client: 'pg', 
    connection: {
      connectionString: PGCONNECTIONURI,
      ssl: {rejectUnauthorized:false}
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  };  