var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields: ['email', 'displayName'],
		passReqToCallback : true
	}, 
	function(req, accessToken, refreshToken, profile, done) {
		console.log('passport의 facebook 호출됨.');
		console.dir(profile);


		var database = req.app.get('database');

		if (database.pool) {

			const data = [
				profile._json.email
			]
			
			console.dir(database.user);
			
			database.user.findUser(database.pool, data, function(err, rows) {
				// 에러 발생 시 - 클라이언트로 에러 전송
				if (err) {
					console.error('User 저장 중 에러 발생 : ' + err.stack);
					return;
				}

				// 결과 객체 있으면 성공 응답 전송
				if (!rows.length) {

					var data = {
						provider:profile.provider,
						name:profile.displayName,
						id:profile._json.email,
						facebook_id:profile.id,
					};

					database.user.insertUser(database.pool, data, function(err, rows) {
						if (err) {
							console.log('SQL 실행 시 에러 발생함.');
							console.dir(err); 
							done(err, null);
							return;
						}

						const data = [
							profile.emails[0].value
						]

						database.user.findUser(database.pool, data, function(err, rows) {
							if(err){
								done(err, null);
								return;
							}
							return done(null,rows[0])
						});	

						// return done(null, data)
					});

				} else {
					console.log('기존에 계정이 있음.');
					return done(err, rows[0]);
				}
			});

		}
	});
};
