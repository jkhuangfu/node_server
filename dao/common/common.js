/* 
    ctrlCommon:数据库连接池及其他应用
*/
const mysql = require('mysql');
const sqlConf = require('../../conf/mySql');
const util = require('../../util/util');
const log4js = require('../../log4/log4');
module.exports = {
    ctrlCommon: (app) => {
        global.log4 = log4js.log; //全局日志
        let mysqlConfig;
        if (app.get('env') == 'development') {
            log4.Info('测试环境');
            mysqlConfig = sqlConf.mysqlDev;
        } else if (app.get('env') == 'production') {
            log4.Info('线上环境');
            mysqlConfig = sqlConf.mysqlOnline;
        };
        global.sql = require('../sqlMap');
        /* 使用连接池 */
        global.pool = mysql.createPool(util.extend({}, mysqlConfig));
        /* 向前台返回数据 方法*/
        global.jsonWrite = (res, ret) => {
            if (typeof ret === 'undefind') {
                res.json({
                    code: '999',
                    msg: '操作失败'
                });
            } else {
                res.json(ret);
            }
        };
    }
};