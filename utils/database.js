const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user : "root",
    password:"",
    database: "login"
}) 

conn.connect(function(err){
    if(err){
        console.log("🚀 ~ DATABASE ~ connection: ERROR");
    }
    else{
        console.log("🚀 ~ DATABASE ~ Connected");
    }
})

module.exports = conn;