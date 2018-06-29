const express = require('express');
const http = require('http');
const path = require('path');

// Post 방식 사용
const bodyParser = require('body-parser');

// Folder 개방
const static = require('serve-static');

// 라우터 객체 참조
let cookieParser = require('cookie-parser')

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// Passport 사용
var passport = require('passport');
var flash = require('connect-flash');

// config 파일 불러오기
var config = require('./config/config');

// 라우팅 처리 모듈 불러오기
var route_loader = require('./routes/route_loader');

// 에러 핸들러 모듈 사용
var error = require('./routes/error');

// 익스프레스 객체 생성
const app = express();

// 뷰 엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 설정 파일에 들어있는 port 정보 사용하여 포트 설정
app.set('port', config.server_port);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더, uploads 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


// Passport 사용 설정 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

app.set('passport', passport);

const router = express.Router();
const upload = require('./config/fileupload').upload

// router 설정
route_loader.init(app, router, upload);

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 패스포트 라우팅 설정
var userPassport = require('./routes/user_passport');
userPassport(router, passport);


// Error Page 처리
app.use( error.httpError );
app.use( error.errorHandler );


// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
});

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});

// Express Server Start
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express Server Strart' + app.get('port'));

  // 데이터베이스 초기화
	database.init(app, config);
});

