/*
    全局变量
*/
const mysql = require('mysql');
const { mysqlDev, mysqlOnline } = require('../config/mySql');
const util = require('../util/inedx');
const log4js = require('../util/log4');
const redisDb = require('./redisTool');
global.log4 = log4js.log; //全局日志
global.sql = require('../sql/sqlMap');
global.md5 = require('md5');
global.reqBody = (req) => util.reqBody(req);
module.exports = {
    ctrlCommon: (app) => {
        const mysqlConfig = app.get('env') === 'development' ? mysqlDev : mysqlOnline;
        /* 使用连接池 */
        global.pool = mysql.createPool(Object.assign({}, mysqlConfig));
        global.redisDb = redisDb(app);
        global.writeResponse = (res,response) => {
            res.json({...response});
        }
    }
};
