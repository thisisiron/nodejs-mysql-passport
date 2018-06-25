// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// 404 에러 페이지 처리
var error = {
    errorHandler: expressErrorHandler({
        static: {
          '404': './public/404.html'
        }
    }),
    httpError: expressErrorHandler.httpError(404)
};


module.exports = error;