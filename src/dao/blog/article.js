/*
 * 文章处理 Module 是否展示，删除
 */
const moment = require('moment');
module.exports = {
    /*
    * 根据类型（显示，隐藏）查询文章列表
    * {pageIndex}:页码
    * {pageSize}:每页条数
    * {type}:文章显示类型 0 未展示,1已展示,2查询全部
    * */
    queryArticleByType: (req, res) => {
        let { pageIndex,pageSize,type  } = reqBody(req);
        let querySql,queryCountSql;
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
                        res.json({code:500,msg:err});
                        connection.release();
                        return false;
                    } else {
                        resolve(response[0].count);
                        log4.Info('查询文章总条数成功====' + response[0].count);
                    }
                });
            });
            connection.query(querySql, (err, response) => {
                if (err) {
                    log4.Error(err);
                    res.json({code:500,msg:err});
                    connection.release();
                    return false;
                }
                response.forEach(row => {
                    row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                });
                log4.Info('查询文章成功====' + count);
                res.json({ code: 200, data: response, count: count });
                connection.release();
            });
        });
    },
    /*
    * 修改文章显示状态
    * {status}:显示状态 0隐藏 1 显示
    * {id}:文章 id（批量的话字符串以','分割）
    * */
    changeArticleStatus: (req, res) => {
        let {status,id} = reqBody(req);
        let sql = 'update article set isShow = ' + status + ' where id in(' + id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code:500,msg:err});
                return false;
            }
            connection.query(sql, (err, response) => {
                if (err) {
                    log4.Error(err);
                    res.json({ code: 500, msg: '更改出错' });
                }else{
                    res.json({ code: 200, msg: '成功' });
                }
                connection.release();
            })
        })
    },
    /*
    * 删除文章
    * {id}:文章 id
    * */
    deleteArticle: (req, res) => {
        let { id } = reqBody(req);
        if (id.length > 1) {
            id = id.join(',');
        }
        let sql = 'DELETE FROM article WHERE id in(' + id + ')';
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code:500,msg:err});
                return false;
            }
            connection.query(sql, (err, response) => {
                if (err) {
                    res.json({code:500,msg:err});
                }else{
                    res.json({code:200,msg:'删除成功'});
                }
                connection.release();
            })
        })
    },
    /*
    * 模糊查询文章
    * {articleTitle}:文章标题
    * {pageIndex,pageSize}:页码,条数
    * {type}:文章的显示类型
    * */
    queryArticleByTitleAndStatus: (req, res) => {
        let {articleTitle,pageIndex,pageSize,type} = reqBody(req);
        let querySql,countSql,sql;
        if (type == 2) { //全部
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
                            log4.Error(err);
                            reject(err);
                            res.json({code:500,msg:err});
                            connection.release();
                            return false;
                        }
                        resolve(response[0].count);
                        log4.Info('模糊查询文章总条数成功====' + count);
                    });
                });
                connection.query(querySql, (err, response) => {
                    if (err) {
                        res.json({ code: 500, msg: err });
                        connection.release();
                        return;
                    }
                    response.forEach(row => {
                        row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
                    });
                    log4.Info('模糊查询文章成功====' + count);
                    res.json({ code: 200, data: response, count: count });
                    connection.release();
                })
            } catch (error) {
                res.json({ code: 500, message: error });
            }
        })
    },
    /*
    * 发布文章
    * {articleTitle}：文章 title
    * {articleCon}：文章内容
    * */
    publishArticle: (req, res) => {
        let {articleTitle,articleCon} = reqBody(req);
        let sql = 'INSERT INTO article(articleTitle,articleCon,createTime) values(?,?,now())';
        let insertData = [articleTitle, articleCon];
        if (!articleTitle || !articleCon) {
            log4.Error('数据不全');
            res.json({ code: 99, msg: '数据不全' });
            return;
        }
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error('发布信息出错信息====' + err);
                res.json({ code: 500, msg: '数据库连接池出错',info:err });
                return;
            }
            connection.query(sql, insertData, (err, response) => {
                if (err) {
                    log4.Error('发布文章出错信息====' + err);
                    res.json({ code: 500, msg: err });
                    connection.release();
                    return false;
                }
                res.json({ code: 200, msg: '发布成功' })
                connection.release();
            })
        })
    },
    /*
    * 前端页面根据文章 id 获取文章内容
    * */
    queryArticleById: (req,res) => {
        let { id } = reqBody(req)
        let sql = 'SELECT * FROM article WHERE id = ' + id;
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code:500,msg:err})
                return false;
            }
            connection.query(sql, (err, response) => {
                if (err) {
                    log4.Error(err);
                    res.json({code:500,msg:err});
                    connection.release();
                    return false;
                }
                res.json({code:200,msg:'success',article:response})
                connection.release();
            });
        });
    }
};
