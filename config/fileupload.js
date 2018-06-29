// file upload 설정
const multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
    // callback 함수를 통해서 파일 저장 디렉토리 설정
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    // callback 함수를 통해서 파일 이름 설정
    filename: function (req, file, callback) { 
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

module.exports.upload = multer({ 
    storage: storage,
    limits: {
		files: 100,
		fileSize: 1024 * 1024 * 1024
	}
});