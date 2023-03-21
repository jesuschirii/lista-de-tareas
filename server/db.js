const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "jesuschirii",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "listatareas",

  /*  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DBPORT,
  database: "listatareas", */
});

module.exports = pool;
