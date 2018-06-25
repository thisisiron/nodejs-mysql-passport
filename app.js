let express = require('express');
let http = require('http');
let path = require('path');

// Post 방식 사용
let bodyParser = require('body-parser');

// Folder 개방
let static = require('serve-static');

// 라우터 객체 참조
let cookieParser = require('cookie-parser')
var errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기
var mysql = require('mysql');

// user에 관한 함수 모듈
var user = require('./routes/user');

var config = require('./config');

var route_loader = require('./routes/route_loader');

// 익스프레스 객체 생성
var app = express();

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
 

// MySQL 데이터베이스 연결 설정
var pool      =    mysql.createPool({
    connectionLimit : 10, // Connection을 몇 개 만들지 설정
    host     : 'localhost',
    user     : 'root', // 데이터베이스 User
    password : '12345', // password 입력
    database : 'test', // 데이터베이스 명 입력
    debug    :  false
});

app.set('pool', pool);


route_loader.init(app, express.Router());

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

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

