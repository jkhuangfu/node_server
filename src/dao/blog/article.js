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
    changeArticleStatus: async ctx => {
        const {status, id} = reqBody(ctx);
        const sql = 'update article set isShow = ' + status + ' where id in(' + id + ')';
        const data = await dbquery(sql);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        ctx.body = {code: 200, msg: '修改成功'};
    },
    /*
     * 删除文章
     * {id}:文章 id（批量的话字符串以','分割）
     * */
    deleteArticle: async ctx => {
        const {id} = reqBody(ctx);
        const sql = 'DELETE FROM article WHERE id in(' + id + ')';
        const data = await dbquery(sql);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        ctx.body = {code: 200, msg: '删除成功'};
    },
    /*
     * 模糊查询文章
     * {articleTitle}:文章标题
     * {pageIndex,pageSize}:页码,条数
     * {type}:文章的显示类型
     * */
    queryArticle: async ctx => {
        const {articleTitle, pageIndex = 1, pageSize = 20, type = 2} = reqBody(ctx);
        let querySql, countSql, sql;
        if (Number(type) === 2) {
            // 全部
            querySql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%" limit ${(pageIndex - 1) * pageSize},${pageSize}`;
            sql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        } else {
            querySql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"  AND isShow = ${type} limit ${(pageIndex - 1) * pageSize} , ${pageSize}`;
            sql = `SELECT id,articleTitle,createTime,isShow FROM article WHERE articleTitle LIKE  "%${articleTitle}%"  AND isShow = ${type}`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        }
        const count_result = await dbquery(countSql);
        if (count_result.code !== 200) {
            ctx.body = count_result;
            return false;
        }
        const article_result = await dbquery(querySql);
        if (article_result.code !== 200) {
            ctx.body = article_result;
            return false;
        }
        let article_res = article_result.result;
        article_res.forEach(row => {
            row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
        });
        ctx.body = {
            code: 200,
            data: article_res,
            count: count_result.result[0].count
        };
    },
    /*
     * 发布文章
     * {articleTitle}：文章 title
     * {articleCon}：文章内容
     * */
    publishArticle: async ctx => {
        const {articleTitle, articleCon} = reqBody(ctx);
        const sql = 'INSERT INTO article(articleTitle,articleCon,createTime) values(?,?,now())';
        const insertData = [articleTitle, articleCon];
        if (!articleTitle || !articleCon) {
            log4.Error('数据不全');
            ctx.body = {code: 99, msg: '数据不全'};
            return;
        }
        const data = await dbquery(sql, insertData);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        ctx.body = {code: 200, msg: '发布成功'};
    },
    /*
     * 前端页面根据文章 id 获取文章内容
     * */
    queryArticleById: async ctx => {
        const {id} = reqBody(ctx);
        const sql = 'SELECT * FROM article WHERE id = ' + id;
        const data = await dbquery(sql);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        ctx.body = {code: 200, msg: 'success', article: data.result[0]};
    }
};
