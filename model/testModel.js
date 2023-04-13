const mysql = require("mysql");
require('dotenv').config()
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : 'saurav'
  });


  module.exports = connection;