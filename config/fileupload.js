// file upload setting
const multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
    // Set file save directory through callback function
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    // Set file name directory through callback function
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