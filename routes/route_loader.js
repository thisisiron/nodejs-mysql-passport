var route_loader = {};

var config = require('../config/config');

route_loader.init = (app, router, upload) => {
    console.log('Call route_loader init')
    
    initRoutes(app, router, upload);
}

function initRoutes(app, router, upload) {
    console.log('Call initRoutes')

    var infoLen = config.route_info.length;
	console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];

        
		// 모듈 파일에서 모듈 불러옴
		var curModule = require(curItem.file);
		console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);
		
		// Routing Processing
		if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type == 'post') {
			if (curItem.upload) {
                router.route(curItem.path).post(upload.array(curItem.upload, 1), curModule[curItem.method]);
            } else {
                router.route(curItem.path).post(curModule[curItem.method]);
            }
		} else {
            console.log("Don't know the type of Routing Method")
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		
		
		console.log('라우팅 모듈 [%s]이(가) 설정됨.', curItem.method);
    }
    
    // Router registration
    app.use('/', router);
}


module.exports = route_loader;
