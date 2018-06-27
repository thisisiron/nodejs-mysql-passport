var home = function(req, res) {
	console.log('/ 패스 요청됨.');

	console.log('req.user의 정보');
	console.dir(req.user);

	// 인증 안된 경우
	if (!req.user) {
		console.log('사용자 인증 안된 상태임.');
		res.render('index.ejs', {login_success:false});
	} else {
		console.log('사용자 인증된 상태임.');
		res.render('index.ejs', {login_success:true});
	}
} 


module.exports.home = home;