/*
 *  Photo Table
 */

var photo = {};

var sql = {
    uploadPhoto:'insert into photo set ?'
}

var uploadPhoto = function(pool, data, callback) {
	console.log('uploadPhoto 호출됨.');
    console.dir(data);
	pool.execute(pool, sql.uploadPhoto, data, callback);
};


photo.uploadPhoto = uploadPhoto;
module.exports = photo;