const express = require('express');
const http = require('http');
const path = require('path');

// Using Post Method
const bodyParser = require('body-parser');

// Folder opening
const static = require('serve-static');

// Router object reference
const cookieParser = require('cookie-parser')

// Import Session Middleware
var expressSession = require('express-session');

// Using Passport and flash 
var passport = require('passport');
var flash = require('connect-flash');

// Import config file
var config = require('./config/config');

// Load routing processing module
var route_loader = require('./routes/route_loader');

// Using error handler module
var error = require('./routes/error');

// Creating an Express object
const app = express();

// Set View Engine
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
 
// Set cookie-parser
app.use(cookieParser());

// Set Session
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

// Using Helmet that is a security program.
var helmet = require('helmet');
app.use(helmet());

// Ready to set passport settings
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.set('passport', passport);

// Import database files
var database = require('./database/database');


// router creation and upload settings
const router = express.Router();
const upload = require('./config/fileupload').upload

// router settings
route_loader.init(app, router, upload);

// Passport settings
var configPassport = require('./config/passport');
configPassport(app, passport);

// Passport router settings
var userPassport = require('./routes/user_passport');
userPassport(router, passport);

// Error Page Processing
app.use( error.httpError );
app.use( error.errorHandler );


// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
});

// 확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
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

  // Initializing the database
	database.init(app, config);
});

