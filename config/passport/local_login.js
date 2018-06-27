var LocalStrategy = require('passport-local').Strategy;
var config = require('../config');

module.exports = new LocalStrategy({
	usernameField : 'id',
	passwordField : 'password',
	passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
}, function(req, id, password, done) { 
	console.log('passport의 local-login 호출됨 : ' + id + ', ' + password);
	
	config.pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        // SQL 문을 실행합니다.
        conn.query("select * from user where id = ?", [id], function(err, rows) {
            conn.release();  // 반드시 해제해야 함

            if(err){
                callback(err, null);
                return;
            }
            
            if (!rows.length) {
            	return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
			}
			
			if (password != rows[0].password){
				console.log("비밀번호가 틀렸습니다.")
				return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
			}
				
			
			console.log('계정과 비밀번호가 일치함.');
			return done(null, rows[0]);
		});
	});
});

