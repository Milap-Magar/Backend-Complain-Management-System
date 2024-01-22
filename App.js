// const db = require('./database/database');
const express = require("express");
const cors = require("cors");
const router = require("./Routes/AdminRoutes");
// const mysql = require('mysql');

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ['GET','POST', 'PUT'],
  credentials: true
}));

app.use(express.json());
app.use('/auth', router.adminRouter)

const Port = "8080";

app.listen(Port, () => {
  console.log(`🚀 ~ Listening to ${Port} ~ CONNECTED`);
});


// const db = mysql.createConnection({
//     host: "localhost",
//     user : "root",
//     password:"",
//     database: "login"
// }) 

// app.get("/", (req, res) => {
//   return res.json("Backend Code");
// });

// app.get("/login", (req, res) => {
//   const sql = "SELECT * FROM students";
//   db.query(sql, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });
