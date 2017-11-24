/* 
    ctrlCommon:数据库连接池及其他医用
    cacp：验证码
*/
module.exports = {
    ctrlCommon: () => {
        const mysql = require('mysql');
        const sqlConf = require('../../conf/mySql');
        const util = require('../../util/util');
        global.sql = require('../sqlMap');
        /* 使用连接池 */
        global.pool = mysql.createPool(util.extend({}, sqlConf.mysql));
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