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
    changeArticleStatus: async (req, res) => {
        const {status, id} = reqBody(req);
        const sql = 'update article set isShow = ' + status + ' where id in(' + id + ')';
        const data = await dbquery(sql);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.json = ({code: 200, msg: '修改成功'});
    },
    /*
    * 删除文章
    * {id}:文章 id
    * */
    deleteArticle: async (req, res) => {
        const {id} = reqBody(req);
        const sql = 'DELETE FROM article WHERE id in(' + id + ')';
        const data = await dbquery(sql);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.json = ({code: 200, msg: '删除成功'});
    },
    /*
    * 模糊查询文章
    * {articleTitle}:文章标题
    * {pageIndex,pageSize}:页码,条数
    * {type}:文章的显示类型
    * */
    queryArticle: async (req, res) => {
        const {articleTitle, pageIndex = 1, pageSize = 20, type = 2} = reqBody(req);
        let querySql, countSql, sql;
        if (Number(type) === 2) { //全部
            querySql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%" limit ${(pageIndex - 1) * pageSize},${pageSize}`;
            sql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        } else {
            querySql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"  AND isShow = ${type} limit ${(pageIndex - 1) * pageSize} , ${pageSize}`;
            sql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"  AND isShow = ${type}`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        }
        const db_result = await dbquery(countSql + ';' + querySql);
        if (db_result.code !== 200) {
            res.json(db_result);
            return false;
        }
        const result = db_result.result;
        const count = result[0].count;
        let article_res = result[1];
        article_res.forEach(row => {
            row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
        });
        res.json({
            code: 200,
            data: article_res,
            count
        });
    },
    /*
    * 发布文章
    * {articleTitle}：文章 title
    * {articleCon}：文章内容
    * */
    publishArticle: async (req, res) => {
        const {articleTitle, articleCon} = reqBody(req);
        const sql = 'INSERT INTO article(articleTitle,articleCon,createTime) values(?,?,now())';
        const insertData = [articleTitle, articleCon];
        if (!articleTitle || !articleCon) {
            log4.Error('数据不全');
            res.json({code: 99, msg: '数据不全'});
            return false;
        }
        const data = await dbquery(sql, insertData);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.json({code: 200, msg: '发布成功'});
    },
    /*
    * 前端页面根据文章 id 获取文章内容
    * */
    queryArticleById: async (req, res) => {
        const {id} = reqBody(req);
        const sql = 'SELECT * FROM article WHERE id = ' + id;
        const data = await dbquery(sql);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.json({code: 200, msg: 'success', article: data.result[0]});
    }
};
