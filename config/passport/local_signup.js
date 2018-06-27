var LocalStrategy = require('passport-local').Strategy;
var config = require('../config')
module.exports = new LocalStrategy({
		usernameField : 'id',
		passwordField : 'password',
		passReqToCallback : true    // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, id, password, done) {
        // 요청 파라미터 중 name 파라미터 확인
        var paramName = req.body.name || req.query.name;
	 
		console.log('passport의 local-signup 호출됨 : ' + id + ', ' + password + ', ' + paramName);
		// 삽입 후 데이터를 넘겨줌.
		conn.query("select * from user where id = ?", [id], function(err, rows) {
			if(err){
				done(err, null);
				return;
			}
			done(null,rows[0])
		});		
	    process.nextTick(function() {

			config.pool.getConnection(function(err, conn) {

				//에러 체크
				if (err) {
					if (conn) {
						conn.release();  // 반드시 해제해야 함
					}
					done(err, null);
					return;
				}   

				console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
		
				// SQL 문을 실행합니다.
				conn.query("select * from user where id = ?", [id], function(err, rows) {
					conn.release();  // 반드시 해제해야 함
		
					if(err){
						done(err, null);
						return;
					}

					if(rows.length){
						console.log('기존에 계정이 있음.');
		            	return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
					}
					
					if (!rows.length) {
						var data = {id:id, password:password, name:paramName};
						var exec = conn.query('insert into user set ?', data, function(err, result) {

							console.log('실행 대상 SQL : ' + exec.sql);
							
							if (err) {
								console.log('SQL 실행 시 에러 발생함.');
								console.dir(err);
								done(err, null);
								return;
							}
							
							// 삽입 후 데이터를 넘겨줌.
							conn.query("select * from user where id = ?", [id], function(err, rows) {
								if(err){
									done(err, null);
									return;
								}
								done(null,rows[0])
							});					
									
						});
					}
				});
			});
	});
});
