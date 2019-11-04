const mysql = require('mysql');
const { mysqlDev, mysqlOnline } = require('../config/mySql');

const _dbquery = app => {
    const mysqlConfig = app['env'] === 'development' ? mysqlDev : mysqlOnline;
    /* 使用连接池 */
    const pool = mysql.createPool(Object.assign({}, mysqlConfig));
    const __dbquery = (sql, query = []) => {
        return new Promise(resolve => {
            pool.getConnection((err, connection) => {
                if (err) {
                    resolve({ code: 500, msg: err });
                    return false;
                }
                try {
                    connection.query(sql, query, (e, response) => {
                        if (e) {
                            resolve({ code: 500, msg: e });
                        } else {
                            resolve({ code: 200, data: response });
                        }
                        connection.release();
                    })
                } catch (e) {
                    resolve({ code: 500, msg: `程序异常，sql操作失败--->${e}` });
                }
            });
        });
    };

    return __dbquery;
}

module.exports = _dbquery;
