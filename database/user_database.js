/*
 *  User Table
 */

 var user = {};

 var sql = {
    loginUser:'select * from user where id = ?',
    insertUser:'insert into user set ?',
    findUser:'select * from user where id = ?'
}

var loginUser = function(pool, data, callback) {
	console.log('loginUser 호출됨.');
    console.dir(data);
	pool.execute(pool, sql.loginUser, data, callback);
};

var insertUser = function(pool, data, callback) {
	console.log('insertUser 호출됨.');
    console.dir(data);
	pool.execute(pool, sql.insertUser, data, callback);
};

var findUser = function(pool, data, callback) {
	console.log('findUser 호출됨.');
    console.dir(data);
	pool.execute(pool, sql.findUser, data, callback);
};


user.loginUser = loginUser;
user.insertUser = insertUser;
user.findUser = findUser;
module.exports = user;