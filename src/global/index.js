/*
    全局变量
*/
const { log4js, dbquery, redisDb, reqBody, fetchData, hash } = require('../util/inedx');

global.log4 = log4js.log; //全局日志
global.hash = hash;
global.reqBody = ctx => reqBody(ctx);
global.fetchData = fetchData;
module.exports = {
    ctrlCommon: app => {
        global.dbquery = dbquery(app);
        global.redisDb = redisDb(app);
    }
};
