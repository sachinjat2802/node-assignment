import mysql from 'mysql2';
 export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sachin',
  password: '123456789'
});

export const connected =connection.connect((err)=>{
    if(err) {
        console.log(err)
    }
    else{
        console.log("connection established")
    }
    });
    