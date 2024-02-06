const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const conn = mysql.createConnection({
  host: process.env.DATABSE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

conn.connect(function (err) {
  if (err) {
    console.log("🚀 ~ DATABASE ~ connection: ERROR");
  } else {
    console.log("🚀 ~ DATABASE ~ Connected");
  }
});

module.exports = conn;
