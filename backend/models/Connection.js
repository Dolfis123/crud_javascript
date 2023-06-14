const mysql = require('mysql');
const con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "pendataan_karyawan",
    port: 3306,
})

exports.con =  con