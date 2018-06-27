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

module.exports.board = function(req, res){
	console.log('/board 패스 요청');

	var paramId = req.body.id || req.query.id;
    var paramContent = req.body.content || req.query.content;

	console.log('요청 파라미터 : ' + paramId + ', ' + paramContent);

	const pool = req.app.get('pool');

	if (pool) {
		writeContent(pool, paramId, paramContent, function(err, rows) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
				console.error('에러 발생 : ' + err.stack);
				return;
			}
			
			// 조회된 레코드가 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);

			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송

			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		console.log('데이터베이스 연결 실패')
	}
}


var writeContent = function(pool, id, content, callback) {
		console.log('writeContent 호출됨 : ' + id + ', ' + content);
	
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
	          
	        var columns = ['id', 'name', 'age'];
	        var tablename = 'user';
	 
			// SQL 문을 실행합니다.
			// SQL문 다시 작성해야함.
	        var exec = conn.query("select ?? from ?? where id = ? and  = ?", [columns, tablename, id, content], function(err, rows) {
	            conn.release();  // 반드시 해제해야 함
	            console.log('실행 대상 SQL : ' + exec.sql);
	
	            if(err){
	                callback(err, null);
	                return;
	            }
	            
	            if (rows.length > 0) {
	    	    	console.log('아이디 [%s]와 내용 [%s] 출력', id, content);
	    	    	callback(null, rows);
	            } else {
	            	console.log("일치하는 사용자를 찾지 못함.");
	    	    	callback(null, null);
	            }
	        });
	
	        conn.on('error', function(err) {      
	            console.log('데이터베이스 연결 시 에러 발생함.');
	            console.dir(err);
	            
	            callback(err, null);
	      });
	    });
		
	}