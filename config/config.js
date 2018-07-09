var config = {
    server_port: 3000,

    db:{
        connectionLimit : 10, // Set the number of Connection
        host     : 'localhost',
        user     : 'root', // Database User
        password : '12345', // Database password
        database : 'test', // Database name
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
        callbackURL: '/auth/facebook/callback'
    },
    google:{
        clientID:"",
        clientSecret:"",
        callbackURL: '/auth/google/callback'
    }

};


module.exports = config;