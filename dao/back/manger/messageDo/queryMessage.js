const moment = require('moment');
const log4 = require('../../../../log4/log4').log;
module.exports = {
    deleteMessage: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let param = req.body; //post
        let id = param.id;
        if (id.length > 1) {
            id = id.join(',');
        } else {
            id = id;
        };
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
        const param = req.body; //post
        const pageIndex = param.pageIndex;
        const pageSize = param.pageSize;
        //const sql = 'select * from message order by createTime desc limit ' + pageIndex + ',' + pageSize;
        const querrySql = 'select * from message  limit ' + pageIndex + ',' + pageSize;
        const countSql = 'select COUNT(*) AS count from message';
        let count, allMsg;
        pool.getConnection(async(err, connection) => {
            await connection.query(countSql, (err, response) => {
                if (err) {
                    log4.Warn(err);
                    return;
                }
                count = response[0].count;
                log4.Info('查询总条数成功====' + count);
            });
            await connection.query(querrySql, (err, response) => {
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
        const param = req.body; //post
        const pageIndex = param.pageIndex;
        const pageSize = param.pageSize;
        const articleTitle = param.articleTitle;
        const querrySql = 'select * from message where articleTitle = "' + articleTitle + '" limit ' + pageIndex + ',' + pageSize;
        const sql = 'select * from message where articleTitle = "' + articleTitle + '"';
        const countSql = 'select COUNT(*) AS count from (' + sql + ') t';
        let count, allMsg;
        pool.getConnection(async(err, connection) => {
            await connection.query(countSql, (err, response) => {
                if (err) {
                    log4.Warn(err);
                    return;
                }
                count = response[0].count;
                log4.Info('查询总条数成功====' + count);
            });
            await connection.query(querrySql, (err, response) => {
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