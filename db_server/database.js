// const { response } = require("express")
const {Pool} = require("pg")
require('dotenv').config();
const pool = new Pool({
    user:"postgres",
    password: process.env.DB_PASSWORD,
    host:"localhost",
    port:5432,
    database:"add_user"
})
// const createQuery = `CREATE TABLE acoounts (
//     user_id serial PRIMARY KEY,
//     username VARCHAR (50) UNIQUE NOT NULL,
//     password VARCHAR (50) UNIQUE NOT NULL
// );`
// // pool.query("CREATE DATABASE add_user2;").then((Response)=>{
// //     console.log("Database Created")
// //     console.log(response)
// // })
// pool.query(createQuery).then((Response)=>{
//     console.log("Table Created")
//     console.log(response)
// })
// .catch((e)=>{
//     console.log(e);
// });

pool.query(`select * from accounts`, (err,result)=>{
    if(!err){
        console.log(result.rows);
    }
    
})

module.exports = pool; 