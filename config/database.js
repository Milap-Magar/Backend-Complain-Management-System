const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

exports.pool = mysql
  .createPool({
    host: process.env.DATABSE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port : process.env.PORT,
    dateStrings: true
  })
  .promise();