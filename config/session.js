var mysql = require('mysql');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options ={
    host: 'localhost',
    port:4000,
    user:'root',
    password: '',
    database: 'Purano',
    schema:{
        tableName:'register',
        columnNames: {
            session_id:'custom_session_id'
        }
    }
};

var connection = mysql.createConnection(options); // or mysql.createPool(options);
var sessionStore = new MySQLStore({},connection);

sessionStore.close();