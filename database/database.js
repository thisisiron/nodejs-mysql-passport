//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');


// database 객체에 db, schema, model 모두 추가
var database = {};

// 초기화를 위해 호출하는 함수
database.init = function(app, config) {
	console.log('init() 호출됨.');
	
    createPool(config);
    
	load(app, config);
}

/*
 * MySQL 데이터베이스 연결을 위한 Pool 객체 생성한 후 database.pool 속성으로 추가
 */
function createPool(config) {
    // MySQL 데이터베이스 연결을 위한 Pool 객체 생성
    var pool      =    mysql.createPool({
        connectionLimit : config.db.connectionLimit, 
        host     : config.db.host,
        user     : config.db.user,
        password : config.db.password,
        database : config.db.database,
        debug    : config.db.debug
    });
    
    pool.execute = execute;
    pool.checkGetConnectionError = checkGetConnectionError;
    pool.executeSql = executeSql;
    pool.checkSqlError = checkSqlError;
    
    database.pool = pool;
}


function execute(pool, sql, data, callback) {
    // 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (!pool.checkGetConnectionError(err, conn)) {
            return false;
        } 
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
 
        // SQL 문을 실행함
        var result = pool.executeSql(conn, sql, data, callback);
        return result;
    });
}


/*
 * getConnection 시 에러 확인
 * 에러 발생 시 콜백 호출하고 false 리턴
 */
function checkGetConnectionError(err, conn) {
    if (err) {
        if (conn) {
            conn.release();  // 반드시 해제해야 함
        }

        callback(err, null);
        
        return false;
    } else {
        return true;
    }
}

/**
 * SQL 문 실행
 * SQL 문 정상 실행 또는 에러 시 callback 호출하고 true 또는 false 리턴
 */
function executeSql(conn, sql, data, callback) {
    var exec = conn.query(sql, data, function(err, result) {
        conn.release();  // 반드시 해제해야 함
        console.log('실행 대상 SQL : ' + exec.sql);

        if (!checkSqlError(err, callback)) {
            return false;
        }

        callback(null, result);
        
        return true;
    });
}

/*
 * SQL 실행 시 에러 확인
 * 에러 발생 시 콜백 호출하고 false 리턴
 */
function checkSqlError(err, callback) {
    if (err) {
        console.log('SQL 실행 시 에러 발생함.');
        console.dir(err);

        callback(err, null);

        return false;
    } else {
        return true;
    }
}


/*
 * config에 정의된 데이터베이스 테이블 로딩
 */
function load(app, config) {
	var schemaLen = config.db_schemas.length;
	console.log('설정에 정의된 스키마의 수 : %d', schemaLen);
	
	for (var i = 0; i < schemaLen; i++) {
		var curItem = config.db_schemas[i];
		
		// 모듈 파일에서 모듈 불러온 후 createSchema() 함수 호출하기
		var curSchema = require(curItem.file);
		console.log('테이블 스키마 : database.%s -> %s', curItem.name, curItem.file);
		
		// database 객체에 속성으로 추가
		database[curItem.name] = curSchema;
	}
	
	app.set('database', database);
	console.log('database 객체가 app 객체의 속성으로 추가됨.');
}
 

// database 객체를 module.exports에 할당
module.exports = database;