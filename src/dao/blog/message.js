const moment = require('moment');
const requestIp = require('request-ip');
module.exports = {
    /*
    * 删除留言(批量)
    * {id}：留言 id （字符串类型，批量的话用','隔开）
    * */
    deleteMessage: (req, res) => {
        let { id } = reqBody(req);
        let data = { code: 500, msg: '服务出错' };
        let sql = 'DELETE FROM message WHERE id in(' + id + ')';
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (result) {
                    if (result.warningCount === 0) {
                        data = { code: 1, msg: '删除成功' };
                    } else {
                        data = { code: 2, msg: '不完全成功' };
                    }
                } else {
                    data = { code: 500, msg: '删除失败' };
                }
                res.json(data);
                connection.release();
            })
        });
    },
    /*
    * 获取留言列表
    * */
    getMsgList: (req, res) => {
        const { pageIndex=0, pageSize=20} = reqBody(req);
        //const sql = 'select * from message order by createTime desc limit ' + pageIndex + ',' + pageSize;
        const querySql = 'select * from message  limit ' + pageIndex + ',' + pageSize;
        const countSql = 'select COUNT(*) AS count from message';
        let count, allMsg;
        pool.getConnection(async(err, connection) => {
            if(err){
                res.json({code:500,msg:'数据库连接失败',err});
                return  false;
            }
            try{
                count = await new Promise((resolve, reject) => {
                    connection.query(countSql, (err, response) => {
                        if (err) {
                            log4.Error(err);
                            resolve(false);
                            res.json({ code: 500, msg:err });
                        } else {
                            log4.Info('查询总条数成功====' + response[0].count);
                            resolve(response[0].count)
                        }
                    });
                });
                if(count){
                    connection.query(querySql, (err, response) => {
                        if (err) {
                            log4.Error(err);
                            res.json({ code: 500, msg:err });
                            connection.release();
                            return false;
                        }
                        response.forEach(row => {
                            row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                        });
                        allMsg = response;
                        res.json({ code:200, data: allMsg, count: count });
                        log4.Info('查询所有信息成功');
                        connection.release();
                    });
                }else{
                    res.json({code:500,msg:'信息查询出错'});
                    connection.release();
                }
            }catch (e) {
                res.json({code:500,msg:'信息查询服务出错',e});
            }
        })
    },
    /*
    *  根据文章 title 精确查询留言
    * */
    getMsgByTitle: (req, res) => {
        const { pageIndex=0, pageSize=20,articleTitle } = reqBody(req);
        const querySql = 'select * from message where articleTitle = "' + articleTitle + '" limit ' + pageIndex + ',' + pageSize;
        const sql = 'select * from message where articleTitle = "' + articleTitle + '"';
        const countSql = 'select COUNT(*) AS count from (' + sql + ') t';
        let count, allMsg;
        pool.getConnection(async(err, connection) => {
            count = await new Promise((resolve, reject) => {
                connection.query(countSql, (err, response) => {
                    if (err) {
                        log4.Error(err);
                        reject(err);
                        res.json({ code: 500, msg:err });
                        connection.release();
                        return false;
                    } else {
                        log4.Info('查询总条数成功====' + response[0].count);
                        resolve(response[0].count);
                    }
                });
            });
            connection.query(querySql, (err, response) => {
                if (err) {
                    log4.Error(err);
                    res.json({ code: 500, msg:err });
                    connection.release();
                    return false;
                }
                response.forEach(row => {
                    row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                });
                allMsg = response;
                res.json({ data: allMsg, count: count });
                log4.Info('查询所有信息成功');
                connection.release();
            });
        })
    },
    /*
    * 发布留言
    * */
    publishMessage:(req,res)=> {
        const {id, messageCon, articleTitle} = reqBody(req);
        const clientIp = requestIp.getClientIp(req);
        let sql = `INSERT INTO message(articleId,articleTitle,msgCon,status,createTime,ip) VALUES(?,?,?,?,now(),?) `;
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code: 500, msg: err});
                return false;
            }
            try{
                connection.query(sql, [id,articleTitle,messageCon,0,clientIp],(err, response) => {
                    if (err) {
                        log4.Error(err);
                        res.json({code: 500, msg: err});
                        connection.release();
                        return false;
                    }
                    res.json({code: 200, msg: '留言成功'});
                    connection.release();
                })
            }catch (e) {
                res.json({code: 500, msg:'留言服务出错', err});
            }
        })
    }
};
