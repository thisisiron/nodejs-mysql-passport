var config = {
    server_port: 3000,

    db:{
        connectionLimit : 10, // Connection을 몇 개 만들지 설정
        host     : 'localhost',
        user     : 'root', // 데이터베이스 User
        password : '12345', // password 입력
        database : 'test', // 데이터베이스 명 입력
        debug    :  false
    },

    db_schemas: [
        {name:'user', file:'../database/user_database'},
        {name:'board', file:'../database/board_database'},
        {name:'photo', file:'../database/photo_database'}
	],

    route_info: [
        {file:'../routes/user', path:'/', method:'home', type:'get'},
        {file:'../routes/user', path:'/board', method:'board', type:'get'},
        {file:'../routes/user', path:'/process/addpost', method:'addContent', type:'post'},
        {file:'../routes/user', path:'/process/photo', method:'photo', type:'post',upload:'photo'},
        {file:'../routes/user', path:'/profile/photo', method:'profilephoto', type:'get'},
        
    ],

    facebook:{
        clientID: "",
        clientSecret:"",
        callbackURL: ''
    },
    google:{
        clientID:"",
        clientSecret:"",
        callbackURL: ''
    }

};


module.exports = config;