/*
    全局变量
*/
const mysql = require('mysql');
const sqlConf = require('../config/mySql');
const util = require('../util/inedx');
const log4js = require('../util/log4');
const redisDb = require('./redisTool');
global.log4 = log4js.log; //全局日志
global.sql = require('../sql/sqlMap');
global.md5 = require('md5');
global.reqBody = (req) => util.reqBody(req);
module.exports = {
    ctrlCommon: (app) => {
        let mysqlConfig;
        if (app.get('env') === 'development') {
            log4.Info('测试环境');
            mysqlConfig = sqlConf.mysqlDev;
        } else if (app.get('env') === 'production') {
            log4.Info('线上环境');
            mysqlConfig = sqlConf.mysqlOnline;
        }
        /* 使用连接池 */
        global.pool = mysql.createPool(Object.assign({}, mysqlConfig));
        global.redisDb = redisDb(app);
        global.writeResponse = (res,response) => {
            res.json({...response});
        }
    }
};
