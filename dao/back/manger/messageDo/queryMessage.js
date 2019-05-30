const moment = require('moment');
module.exports = {
    deleteMessage: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let { id } = req.body; //post
        if (id.length > 1) {
            id = id.join(',');
        }
        let data = { code: 500, msg: '服务出错' };
        let sql = 'DELETE FROM message WHERE id in(' + id + ')';
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (result) {
                    if (result.warningCount == 0) {
                        data = { code: 1, msg: '删除成功' };
                    } else {
                        data = { code: 2, msg: '不完全成功' };
                    }
                } else {
                    data = { code: 400, msg: '删除失败' };
                };
                jsonWrite(res, data);
                connection.release();
            })
        });
    },
    getMsg: (req, res, next) => {
        const { pageIndex, pageSize} = req.body; //post
        //const sql = 'select * from message order by createTime desc limit ' + pageIndex + ',' + pageSize;
        const querrySql = 'select * from message  limit ' + pageIndex + ',' + pageSize;
        const countSql = 'select COUNT(*) AS count from message';
        let count, allMsg;
        pool.getConnection(async(err, connection) => {
            count = await new Promise((resolve, reject) => {
                connection.query(countSql, (err, response) => {
                    if (err) {
                        log4.Warn(err);
                        reject(err);
                        return;
                    } else {
                        log4.Info('查询总条数成功====' + response[0].count);
                        resolve(response[0].count)
                    }
                });
            });
            connection.query(querrySql, (err, response) => {
                if (err) {
                    log4.Warn(err);
                    return;
                }
                response.forEach(row => {
                    row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                });
                allMsg = response;
                jsonWrite(res, { data: allMsg, count: count });
                log4.Info('查询所有信息成功');
                connection.release();
            });

        })
    },
    getMsgByTitle: (req, res, next) => {
        const { pageIndex, pageSize,articleTitle } = req.body; //post
        const querrySql = 'select * from message where articleTitle = "' + articleTitle + '" limit ' + pageIndex + ',' + pageSize;
        const sql = 'select * from message where articleTitle = "' + articleTitle + '"';
        const countSql = 'select COUNT(*) AS count from (' + sql + ') t';
        let count, allMsg;
        pool.getConnection(async(err, connection) => {
            count = await new Promise((resolve, reject) => {
                connection.query(countSql, (err, response) => {
                    if (err) {
                        log4.Warn(err);
                        reject(err);
                        return;
                    } else {
                        log4.Info('查询总条数成功====' + response[0].count);
                        resolve(response[0].count);
                    }
                });
            });
            connection.query(querrySql, (err, response) => {
                if (err) {
                    log4.Warn(err);
                    return;
                }
                response.forEach(row => {
                    row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                });
                allMsg = response;
                jsonWrite(res, { data: allMsg, count: count });
                log4.Info('查询所有信息成功');
                connection.release();
            });

        })
    }
}