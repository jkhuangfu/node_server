/*
 * 文章处理 Module 是否展示，删除
 */
const moment = require('moment');
module.exports = {
    queryArticleByType: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let { pageIndex,pageSize,type  } = req.body; //post
        let querySql = "";
        let queryCountSql = "";
        if (Number(type) === 2) { //全部
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article limit ' + pageIndex + ',' + pageSize;
            queryCountSql = 'SELECT COUNT(*) AS count from article';
        } else {
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE isShow = ' + Number(type) + ' limit ' + pageIndex + ', ' + pageSize;
            queryCountSql = 'SELECT COUNT(*) AS count from article WHERE isShow = ' + Number(type);
        }
        /**
         * type:0 未展示,1已展示,2查询全部
         */
        pool.getConnection(async(err, connection) => {
            let count = 0;
            count = await new Promise((resolve, reject) => {
                connection.query(queryCountSql, (err, response) => {
                    if (err) {
                        log4.error(err);
                        reject(err);
                        return;
                    } else {
                        resolve(response[0].count);
                        log4.Info('查询文章总条数成功====' + response[0].count);
                    }
                });
            });
            connection.query(querySql, (err, response) => {
                if (err) {
                    log4.writeErr(err);
                    return;
                };
                response.forEach(row => {
                    row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                });
                log4.Info('查询文章成功====' + count);
                jsonWrite(res, { code: 1, data: response, count: count });
                connection.release();
            });
        });
    },
    changeArticleStatus: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let {status,id} = req.body; //post
        //let id = param.id;
        if (id.length > 1) {
            id = id.join(',');
        }
        let sql = 'update article set isShow = ' + status + ' where id in(' + id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                log4.writeErr(err);
                return;
            };
            connection.query(sql, (err, response) => {
                if (err) {
                    log4.writeErr(err);
                    jsonWrite(res, { code: 9, msg: '更改出错' });
                    connection.release();
                    return;
                };
                jsonWrite(res, { code: 1, msg: '成功' });
                connection.release();
            })
        })
    },
    deleteArticle: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let { id } = req.body; //post
        if (id.length > 1) {
            id = id.join(',');
        }
        let sql = 'DELETE FROM article WHERE id in(' + id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Warn(err);
                return;
            };
            connection.query(sql, (err, response) => {
                if (err) {
                    jsonWrite(res, { code: 9, msg: '删除出错' });
                    connection.release();
                    return;
                };
                jsonWrite(res, { code: 1, msg: '删除成功' });
                connection.release();
            })
        })
    },
    queryArticleByTitleAndStatus: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let {articleTitle,pageIndex,pageSize,type} = req.body; //post
        let querySql = '';
        let countSql = '';
        let sql = '';
        if (type === 2) { //全部
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + articleTitle + '%" limit ' + pageIndex + ', ' + pageSize;
            sql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + articleTitle + '%"';
            countSql = 'SELECT COUNT(*) AS count from (' + sql + ') t';
        } else {
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + articleTitle + '%"  AND isShow = ' + type + ' limit ' + pageIndex + ',' + pageSize;
            sql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + articleTitle + '%"  AND isShow = ' + type;
            countSql = 'SELECT COUNT(*) AS count from (' + sql + ') t';
        }
        pool.getConnection(async(err, connection) => {
            try {
                let count = 0;
                count = await new Promise((resolve, reject) => {
                    connection.query(countSql, (err, response) => {
                        if (err) {
                            log4.Warn(err);
                            reject(err);
                            return;
                        }
                        resolve(response[0].count);
                        log4.Info('模糊查询文章总条数成功====' + count);
                    });
                });
                connection.query(querySql, (err, response) => {
                    if (err) {
                        jsonWrite(res, { code: 9, msg: '搜索出错' });
                        connection.release();
                        return;
                    };
                    response.forEach(row => {
                        row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                    });
                    log4.Info('模糊查询文章成功====' + count);
                    jsonWrite(res, { code: 1, data: response, count: count });
                    connection.release();
                })
            } catch (error) {
                jsonWrite(res, { code: 500, message: '系统错误' });
            }
        })
    }
}