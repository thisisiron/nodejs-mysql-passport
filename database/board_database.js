/*
 *  Board Table
 */

var board = {};

var sql = {
    writeContent:'insert into board set ?'
}

var writeContent = function(pool, data, callback) {
	console.log('writeContent 호출됨.');
    console.dir(data);
	pool.execute(pool, sql.writeContent, data, callback);
};


board.writeContent = writeContent;
module.exports = board;