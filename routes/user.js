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

	var database = req.app.get('database');

	if (database.pool) {

		var data = {
			user_id: praamId,
			title: paramTitle,
			contents: paramContents
		}
		
		
		
		database.board.writeContent(database.pool, data, function(err, rows) {
			// 에러 발생 시 - 클라이언트로 에러 전송
			if (err) {
				console.error('User 저장 중 에러 발생 : ' + err.stack);
				return;
			}

			// 결과 객체 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);
				res.redirect('/profile');
			} else {
				console.log('Content 저장 실패')
			}
		});

	}

	
}

module.exports.photosave = function(req, res) {
	console.log('/process/save 호출.');
	
	try {
		var paramAuthor = req.body.author;
        var paramContents = req.body.contents;
		var paramCreateDate = req.body.createDate;
		
		console.log('작성자 : ' + paramAuthor);
		console.log('내용 : ' + paramContents);
		console.log('일시 : ' + paramCreateDate);
 
 
        var files = req.files;
	
		console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')
        
		// 현재의 파일 정보를 저장할 변수 선언
		var originalname = '',
			filename = '',
			mimetype = '',
			size = 0;
		
			if (Array.isArray(files)) {   // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
				console.log("배열에 들어있는 파일 갯수 : %d", files.length);
				
				for (var index = 0; index < files.length; index++) {
					originalname = files[index].originalname;
					filename = files[index].filename;
					mimetype = files[index].mimetype;
					size = files[index].size;
				}
	
				console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);
	
			} else {
				console.log('업로드된 파일이 배열에 들어가 있지 않습니다.');
			}
		
        
        var database = req.app.get('database');

        if (database.pool) {

            var data = {
                author:paramAuthor,
                contents:paramContents,
                createDate:paramCreateDate,
                filename:filename
            };
            
            console.dir(database.memo);
            
            database.memo.insertMemo(database.pool, data, function(err, added) {
                
                if (err) {
                    //에러발생
                    return;
                }
                
                if (added) {
                    //성공
                } else {
                    console.log('파일저장실패')
                }
            });

        }
        
	} catch(err) {
		//파일저장에러시 에러발생
		console.dir(err.stack);
	}	
		
};