const mysql = require('mysql');
// import mysql from 'mysql';

const  conn = mysql.createConnection({
    host: '', // 数据库的地址
    port: 8080,
    user: 'root', // 账号
    password: '', // 密码
    database: '', // 数据库名称
});
conn.connect();

module.exports = conn;