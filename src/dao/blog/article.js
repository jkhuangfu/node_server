/*
 * 文章处理 Module 是否展示，删除
 */
const moment = require('moment');
module.exports = {
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
    queryArticle: (req, res) => {
        let { articleTitle, pageIndex = 1, pageSize = 20, type } = reqBody(req);
        let querySql,countSql,sql;
        if (type == 2) { //全部
            querySql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%" limit ${(pageIndex - 1) * pageSize },${pageSize}`;
            sql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        } else {
            querySql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"  AND isShow = ${type} limit ${(pageIndex - 1) * pageSize} , ${pageSize}`;
            sql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"  AND isShow = ${type}`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
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
                if(count){
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
                        res.json({ code: 200,msg:'查询成功', data: response, count: count });
                        connection.release();
                    })
                }else {
                    res.json({ code: 400, msg:'查询失败' });
                    connection.release();
                }
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
            try{
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
            }catch (e) {
                res.json({ code: 500, msg: '发布失败',err });
            }
        })
    },
    /*
    * 前端页面根据文章 id 获取文章内容
    * */
    queryArticleById: (req,res) => {
        let { id } = reqBody(req);
        let sql = 'SELECT * FROM article WHERE id = ' + id;
        pool.getConnection((err, connection) => {
            if (err) {
                log4.Error(err);
                res.json({code:500,msg:err});
                return false;
            }
            try{
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
            }catch (e) {
                res.json({ code: 500, msg: '查询服务异常',err });
            }
        });
    }
};
