var config = {
    server_port: 3000,
    route_info:[
        {file:'./user', path:'/process/login', method:'login', type:'post'},
        {file:'./user', path:'/process/adduser', method:'adduser', type:'post'},
    ]
};


module.exports = config;