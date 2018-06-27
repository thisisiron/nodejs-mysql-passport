var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new GoogleStrategy({
    	clientID: config.google.clientID,
    	clientSecret: config.google.clientSecret,
    	callbackURL: config.google.callbackURL
	}, function(accessToken, refreshToken, profile, done) {
		console.log('passport의 google 호출됨.');
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
			conn.query("select * from user where google_id = ?", profile.id, function(err, user) {
				conn.release();  // 반드시 해제해야 함
	
				if(err) {
					done(err, null);
					return;
				}
				console.log("profile json: "+profile._json);
				console.log("user "+ user)

				if (!user.length) {

					var data = {
						provider:'google',
						name:profile.displayName,
						id:profile.emails[0].value,
						google_id:profile.id,
						// email: profile.emails[0].value,
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
						conn.query("select * from user where id = ?", [profile.id], function(err, rows) {
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
					return done(err, user);
				}
				
			});
		});
	});
};
