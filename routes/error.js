// Using Error Handler Module
var expressErrorHandler = require('express-error-handler');

// 404 Error page processing
var error = {
    errorHandler: expressErrorHandler({
        static: {
          '404': './public/404.html'
        }
    }),
    httpError: expressErrorHandler.httpError(404)
};


module.exports = error;