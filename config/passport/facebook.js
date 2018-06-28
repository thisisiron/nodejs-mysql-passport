var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields: ['email', 'displayName']
	}, function(accessToken, refreshToken, profile, done) {
		console.log('passport의 facebook 호출됨.');
		console.dir(profile);
		
		config.pool.getConnection(function(err, conn) {
			if (err) {
				if (conn) {
					conn.release();  // 반드시 해제해야 함
				}
				done(err, null);
				return;
			}   
			console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
			
			
			
			// SQL 문을 실행합니다.
			conn.query("select * from user where facebook_id = ?", profile.id, function(err, user) {
				conn.release();  // 반드시 해제해야 함
	
				if(err) {
					done(err, null);
					return;
				}
				
				console.log("user "+ user)

				if (!user.length) {

					var data = {
						provider:profile.provider,
						name:profile.displayName,
						id:profile._json.email,
						facebook_id:profile.id,
						password:''
					};

					var exec = conn.query('insert into user set ?', data, function(err, result) {

						console.log('실행 대상 SQL : ' + exec.sql);
						
						if (err) {
							console.log('SQL 실행 시 에러 발생함.');
							console.dir(err); 
							done(err, null);
							return;
						}
						// 삽입 후 데이터를 넘겨줌.
						// 수정필요: 굳이 SQL문 사용하지 않고 위에 있는 data 객체 전달해보기.
						conn.query("select * from user where id = ?", [profile._json.email], function(err, rows) {
							if(err){
								done(err, null);
								return;
							}
							return done(null,rows[0])
						});		
						
					});
				}
				else {
					console.log('기존에 계정이 있음.');
					return done(err, user[0]);
				}
				
			});
		});
	});
};
