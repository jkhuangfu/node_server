/*
    全局变量
*/
const { log4js, _dbquery, redisDb, reqBody } = require('../util/inedx');

global.log4 = log4js.log; //全局日志
global.sql = require('../sql/sqlMap');
global.md5 = require('md5');
global.reqBody = ctx => reqBody(ctx);
module.exports = {
    ctrlCommon: (app) => {
        global.dbquery = _dbquery(app);
        global.redisDb = redisDb(app);
    }
};



