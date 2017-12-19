/*
 * 文章处理 Module 是否展示，删除 
 */
const log4 = require('../../../../log4/log4').log;
const moment = require('moment');
module.exports = {
    queryArticleByType: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let param = req.body; //post
        let querySql = "";
        let queryCountSql = "";
        if (param.type == 2) { //全部
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article limit ' + param.pageIndex + ',' + param.pageSize;
            queryCountSql = 'SELECT COUNT(*) AS count from article';
        } else {
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE isShow = ' + Number(param.type) + ' limit ' + param.pageIndex + ', ' + param.pageSize;
            queryCountSql = 'SELECT COUNT(*) AS count from article WHERE isShow = ' + Number(param.type);
        };
        /**
         * type:0 未展示,1已展示,2查询全部
         */
        pool.getConnection((err, connection) => {
            let count = 0;
            connection.query(queryCountSql, (err, response) => {
                if (err) {
                    log4.writeErr(err);
                    return;
                }
                count = response[0].count;
                log4.Info('查询文章总条数成功====' + count);
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
        let param = req.body; //post
        let id = param.id;
        if (id.length > 1) {
            id = id.join(',');
        } else {
            id = id;
        };
        let sql = 'update article set isShow = ' + param.status + ' where id in(' + param.id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                log4.writeErr(err);
                return;
            };
            connection.query(sql, (err, response) => {
                if (err) {
                    console.log(err)
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
        let param = req.body; //post
        let id = param.id;
        if (id.length > 1) {
            id = id.join(',');
        } else {
            id = id;
        };
        let data = { code: 500, msg: '服务出错' };
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
        let param = req.body; //post
        let querySql = '';
        let countSql = '';
        let sql = '';
        if (param.type == 2) { //全部
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + param.articleTitle + '%" limit ' + param.pageIndex + ', ' + param.pageSize;
            sql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + param.articleTitle + '%"';
            countSql = 'SELECT COUNT(*) AS count from (' + sql + ') t';
        } else {
            querySql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + param.articleTitle + '%"  AND isShow = ' + param.type + ' limit ' + param.pageIndex + ',' + param.pageSize;
            sql = 'SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%' + param.articleTitle + '%"  AND isShow = ' + param.type;
            countSql = 'SELECT COUNT(*) AS count from (' + sql + ') t';
        };
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Warn(err);
                return;
            };
            let count = 0;
            connection.query(countSql, (err, response) => {
                if (err) {
                    log4.Warn(err);
                    return;
                }
                count = response[0].count;
                log4.Info('模糊查询文章总条数成功====' + count);
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
        })
    }
}