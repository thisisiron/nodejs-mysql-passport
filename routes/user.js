module.exports.home = function(req, res) {
	console.log('/ 패스 요청됨.');

	// 인증 안된 경우
	if (!req.user) {
		console.log('사용자 인증 안된 상태임.');
		res.render('index.ejs', {login_success:false});
	} else { // 인증된 경우

		console.log('req.user의 정보');
		console.dir(req.user);

		console.log('사용자 인증된 상태임.');
		res.render('index.ejs', {login_success:true});
	}
} 

module.exports.board = function(req, res) {
	console.log('/board 패스 요청됨.');

	// 인증 안된 경우
	if (!req.user) {
		console.log('사용자 인증 안된 상태임.');
		res.render('index.ejs', {login_success:false});
	} else { // 인증된 경우

		console.log('req.user의 정보');
		console.dir(req.user);

		console.log('사용자 인증된 상태임.');
		res.render('board.html', {login_success:true});
	}
} 

module.exports.addContent = function(req, res){
	console.log('/board 패스 요청');

	var paramTitle = req.body.title || req.query.title;
	var paramContents = req.body.contents || req.query.contents;
	var praamId = req.user.id;

	console.log('req.user의 정보');
	console.dir(req.user);
	console.log('요청 파라미터 : ' + praamId + ', ' + paramTitle + ', ' + paramContents);

	const pool = req.app.get('pool');

	if (pool) {
		writeContent(pool, praamId, paramTitle, paramContents, function(err, rows) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
				console.error('에러 발생 : ' + err.stack);
				return;
			}
			
			// 조회된 레코드가 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);
				res.redirect('/profile');
			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송

			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패')
	}
}


var writeContent = function(pool, id, title, contents, callback) {
		console.log('writeContent 호출됨 : ' + id + ', ' + title + ', ' + contents);
	
		// 커넥션 풀에서 연결 객체를 가져옴
		pool.getConnection(function(err, conn) {
	        if (err) {
	        	if (conn) {
	                conn.release();  // 반드시 해제해야 함
	            }
	            callback(err, null);
	            return;
	        }   
	        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

			var data = {
				user_id: id,
				title: title,
				contents: contents
			}

	        var exec = conn.query("insert into board set ?", data, function(err, rows) {
	            conn.release();  // 반드시 해제해야 함
	            console.log('실행 대상 SQL : ' + exec.sql);
	
	            if(err){
	                callback(err, null);
	                return;
	            }
	            
	            // if (rows.length > 0) {
	    	    // 	console.log('아이디 [%s]와 내용 [%s] 출력', id, content);
	    	    	
	            // } else {
	            // 	console.log("일치하는 사용자를 찾지 못함.");
	    	    // 	callback(null, null);
				// }
				console.log("rows 출력")
				console.dir(rows)
				callback(null, rows);
	        });
	
	        conn.on('error', function(err) {      
	            console.log('데이터베이스 연결 시 에러 발생함.');
	            console.dir(err);
	            
	            callback(err, null);
	      });
	    });
		
	}