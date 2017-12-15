/* 
    ctrlCommon:数据库连接池及其他应用
*/
module.exports = {
    ctrlCommon: () => {
        const mysql = require('mysql');
        const sqlConf = require('../../conf/mySql');
        const app = require('express')();
        let mysqlConfig;
        if (app.get('env') == 'development') {
            console.log('测试环境');
            mysqlConfig = sqlConf.mysqlDev;
        } else if (app.get('env') == 'production') {
            console.log('线上环境');
            mysqlConfig = sqlConf.mysqlOnline;
        };
        const util = require('../../util/util');
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