let express = require('express');
let http = require('http');
let path = require('path');

// Post 방식 사용
let bodyParser = require('body-parser');

// Folder 개방
let static = require('serve-static');

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
var app = express();

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

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
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


 
// database pool 설정
app.set('pool', config.pool);

app.set('passport', passport);

var router = express.Router();
// router 설정
route_loader.init(app, router);

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 패스포트 라우팅 설정
var userPassport = require('./routes/user_passport');
userPassport(router, passport);


// Error Page 처리
app.use( error.httpError );
app.use( error.errorHandler );


// 서버 시작

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
});

// Express Server Start
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express Server Strart' + app.get('port'));
});

