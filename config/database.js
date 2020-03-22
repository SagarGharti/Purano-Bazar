const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'Purano'
})

//connection
con.connect((err) =>
 {if(err){
    throw err;}
  console.log('Database Connected Sucessfully')  
});

module.exports={con};