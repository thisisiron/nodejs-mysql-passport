var route_loader = {};

var config = require('../config/config');

route_loader.init = (app, router) => {
    console.log('route_loader init 호출')
    
    initRoutes(app, router);
}

function initRoutes(app, router) {
    console.log('initRoutes 호출됨.')

    var infoLen = config.route_info.length;
	console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];

        
		// 모듈 파일에서 모듈 불러옴
		var curModule = require(curItem.file);
		console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);
		
		//  라우팅 처리
		if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type == 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
		} else {
            console.log("라우팅 함수의 타입을 알 수 없다.")
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		
		
		console.log('라우팅 모듈 [%s]이(가) 설정됨.', curItem.method);
    }
    
    // 라우터 객체 등록
    app.use('/', router);
}


module.exports = route_loader;
