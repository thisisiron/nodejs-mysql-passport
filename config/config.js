// MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기
var mysql = require('mysql');

var config = {
    server_port: 3000,
    pool: mysql.createPool({
        connectionLimit : 10, // Connection을 몇 개 만들지 설정
        host     : 'localhost',
        user     : 'root', // 데이터베이스 User
        password : '12345', // password 입력
        database : 'test', // 데이터베이스 명 입력
        debug    :  false
    }),
    route_info: [
        {file:'../routes/user', path:'/', method:'home', type:'get'},
        // {file:'../routes/user', path:'/login', method:'login', type:'post'},
    ],
    facebook:{
        clientID: "",
        clientSecret:"",
        callbackURL: '/auth/facebook/callback'
    }
};


module.exports = config;