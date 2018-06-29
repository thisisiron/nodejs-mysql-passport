var LocalStrategy = require('passport-local').Strategy;
var config = require('../config')
module.exports = new LocalStrategy({
		usernameField : 'id',
		passwordField : 'password',
		passReqToCallback : true    // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, 
	function(req, id, password, done) {
        // 요청 파라미터 중 name 파라미터 확인
        var paramName = req.body.name || req.query.name;
	
		var database = req.app.get('database');

		if (database.pool) {

			var data = [
				id,
			]
			
			console.dir(database.user);
			
			database.user.findUser(database.pool, data, function(err, rows) {
				// 에러 발생 시 - 클라이언트로 에러 전송
				if (err) {
					console.error('User 저장 중 에러 발생 : ' + err.stack);
					return;
				}

				if(rows.length){
					console.log('기존에 계정이 있음.');
					return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
				}

				else if (!rows.length) {

					var data = {
						id:id,
						password:password,
						name:paramName
					};

					database.user.insertUser(database.pool, data, function(err, rows) {
						if (err) {
							console.log('SQL 실행 시 에러 발생함.');
							console.dir(err);
							done(err, null);
							return;
						}

						var data = [
							id,
						]

						// 삽입 후 데이터를 넘겨줌.
						database.user.findUser(database.pool, data, function(err, rows) {
							if (err) {
								console.log('SQL 실행 시 에러 발생함.');
								console.dir(err);
								done(err, null);
								return;
							}
							return done(null, rows[0]);
						});
					});
				}
			});
		}
	}
);
