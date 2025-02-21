import pkg from 'pg';
const { Client } = pkg;

export const db = new Client({
 host: "localhost",
 database: "to_do_list",
 user: "postgres",
 password: "Enhypen8991!",
 port: 5432,
});

db.connect()
.then(() => console.log('Connected to PostgresSQL'))
.catch(err => console.error('Connection error', err.stack));