const moment = require('moment');
const { getClientIp } = require('../../util/inedx');
module.exports = {

    /*
    * 修改留言显示状态
    * {status}:显示状态 0隐藏 1 显示
    * {id}:休息 id（批量的话字符串以','分割）
    * */
    changeMessageStatus: (req, res) => {
        let {status, id} = reqBody(req);
        let sql = 'update message set status = ' + status + ' where id in(' + id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code: 500, msg: err});
                return false;
            }
            connection.query(sql, (err, response) => {
                if (err) {
                    log4.Error(err);
                    res.json({code: 500, msg: '更改出错'});
                } else {
                    res.json({code: 200, msg: '成功'});
                }
                connection.release();
            })
        })
    },
    /**
     * @description 删除留言(批量)
     * @param {id}：留言 id （字符串类型，批量的话用','隔开）
     * */
    deleteMessage: (req, res) => {
        let {id} = reqBody(req);
        let sql = 'DELETE FROM message WHERE id in(' + id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                res.json({code: 500, msg: '数据库连接失败', err});
                return false;
            }
            try {
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json({code: 500, msg: '信息删除服务出错', err});
                    }
                    if (result && result.warningCount === 0) {
                        res.json({code: 200, msg: '删除成功'});
                    } else if (result && result.warningCount > 0) {
                        res.json({code: 2, msg: '不完全成功'});
                    }
                    connection.release();
                })
            } catch (e) {
                res.json({code: 500, msg: '信息删除服务出错', e});
            }
        });
    },
    /**
     * 获取留言列表
     *  根据文章 title 精确查询留言
     */
    queryMessage: (req, res) => {
        const {pageIndex = 0, pageSize = 20, articleTitle, type = 2} = reqBody(req);
        let querySql, countSql, sql;
        if (type == 2) { //全部
            querySql = `select * from message where articleTitle like "%${articleTitle}%" limit ${(pageIndex - 1) * pageSize},${pageSize}`;
            sql = `select * from message where articleTitle like "%${articleTitle}%"`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        } else {
            querySql = `select * from message where articleTitle like "%${articleTitle}%" and status = ${type} limit ${(pageIndex - 1) * pageSize},${pageSize}`;
            sql = `select * from message where articleTitle like "%${articleTitle}%" and status = ${type}`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        }
        let count, allMsg;
        pool.getConnection(async (err, connection) => {
            if (err) {
                res.json({code: 500, msg: '数据库连接失败', err})
            }
            try {
                count = await new Promise((resolve, reject) => {
                    connection.query(countSql, (err, response) => {
                        if (err) {
                            log4.Error(err);
                            res.json({code: 500, msg: err});
                            connection.release();
                            return false;
                        } else {
                            log4.Info('查询总条数成功====' + response[0].count);
                            resolve(response[0].count);
                        }
                    });
                });
                if (count >= 0) {
                    connection.query(querySql, (err, response) => {
                        if (err) {
                            log4.Error(err);
                            res.json({code: 500, msg: err});
                            connection.release();
                            return false;
                        }
                        response.forEach(row => {
                            row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                        });
                        allMsg = response;
                        res.json({code: 200, data: allMsg, count: count});
                        log4.Info('查询所有信息成功');
                        connection.release();
                    });
                } else {
                    res.json({code: 400, msg: '查询失败'});
                    connection.release();
                }
            } catch (e) {
                res.json({code: 500, message: e});
            }
        })
    },
    /*
    * 发布留言
    * */
    publishMessage: (req, res) => {
        const {id, messageCon, articleTitle} = reqBody(req);
        const clientIp = getClientIp(req);
        let sql = `INSERT INTO message(articleId,articleTitle,msgCon,status,createTime,ip) VALUES(?,?,?,?,now(),?) `;
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code: 500, msg: err});
                return false;
            }
            try {
                connection.query(sql, [id, articleTitle, messageCon, 0, clientIp], (err, response) => {
                    if (err) {
                        log4.Error(err);
                        res.json({code: 500, msg: err});
                        connection.release();
                        return false;
                    }
                    res.json({code: 200, msg: '留言成功'});
                    connection.release();
                })
            } catch (e) {
                res.json({code: 500, msg: '留言服务出错', err});
            }
        })
    }
};
