var crypto = require('crypto');

encrypto = {}

var encryptPassword = function (password, inSalt){
	if(inSalt){
		return crypto.createHmac('sha512', inSalt).update(password).digest('hex');
	}
};

var authenticate = function(password, inSalt, hashed_password){
	if(inSalt){
		console.log('authenticate 호출')
		return encryptPassword(password, inSalt) == hashed_password;
	}
}

var makeSalt = function() {
	return Math.round((new Date().valueOf() * Math.random())) + "";
};


encrypto.encryptPassword = encryptPassword;
encrypto.authenticate = authenticate;
encrypto.makeSalt = makeSalt;
module.exports = encrypto;