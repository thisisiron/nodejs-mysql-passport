var LocalStrategy = require('passport-local').Strategy;
var encrypto = require('../crypto')

module.exports = new LocalStrategy({
	usernameField : 'id',
	passwordField : 'password',
	passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
}, function(req, id, password, done) { 
	console.log('passport의 local-login 호출됨 : ' + id + ', ' + password);
	
	var database = req.app.get('database');

	if (database.pool) {

		const data = [
			id
		]
		
		console.dir(database.user);
		
		database.user.loginUser(database.pool, data, function(err, rows) {
			// 에러 발생 시 - 클라이언트로 에러 전송
			if (err) {
				console.error('User 저장 중 에러 발생 : ' + err.stack);
				return;
			}


			const authenticated = encrypto.authenticate(password, rows[0].salt, rows[0].password)
	
			// 결과 객체 있으면 성공 응답 전송
			if (!rows.length) {
				return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
			} else if (!authenticated){
				console.log("비밀번호가 틀렸습니다.")
				return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
			}

			console.log('계정과 비밀번호가 일치함.');
			return done(null, rows[0]);
		
		});

	}
});

