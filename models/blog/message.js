const moment = require('moment');
const {getClientIp} = require('../../util/inedx');
module.exports = {
    /*
    * 修改留言显示状态
    * {status}:显示状态 0隐藏 1 显示
    * {id}:休息 id（批量的话字符串以','分割）
    * */
    changeMessageStatus: async (req, res) => {
        const {status, id} = reqBody(req);
        const sql = 'update message set status = ' + status + ' where id in(' + id + ')';
        const data = await dbquery(sql);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.sjon({code: 200, msg: '成功'});
    },
    /**
     * @description 删除留言(批量)
     * {id}：留言 id （字符串类型，批量的话用','隔开）
     * */
    deleteMessage: async (req, res) => {
        const {id} = reqBody(req);
        const sql = 'DELETE FROM message WHERE id in(' + id + ')';
        const data = await dbquery(sql);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        const {result} = data;
        if (result && result.warningCount === 0) {
            res.json({code: 200, msg: '删除成功'});
        } else if (result && result.warningCount > 0) {
            res.json({code: 2, msg: '不完全成功'});
        }
    },
    /**
     * 获取留言列表
     *  根据文章 title 精确查询留言
     */
    queryMessage: async (req, res) => {
        const {pageIndex = 1, pageSize = 20, articleTitle, type = 2} = reqBody(req);
        let querySql, countSql, sql;
        if (Number(type) === 2) { //全部
            querySql = `select * from message where articleTitle like "%${articleTitle}%" limit ${(pageIndex - 1) * pageSize},${pageSize}`;
            sql = `select * from message where articleTitle like "%${articleTitle}%"`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        } else {
            querySql = `select * from message where articleTitle like "%${articleTitle}%" and status = ${type} limit ${(pageIndex - 1) * pageSize},${pageSize}`;
            sql = `select * from message where articleTitle like "%${articleTitle}%" and status = ${type}`;
            countSql = `SELECT COUNT(*) AS count from (${sql}) t`;
        }
        const db_result = await dbquery(countSql + ';' + querySql);
        if (db_result.code !== 200) {
            res.json(db_result);
            return false;
        }
        const result = db_result.result;
        const count = result[0].count;
        let msg_res = result[1];
        msg_res.forEach(row => {
            row.createTime = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
        });
        res.json({
            code: 200,
            data: msg_res,
            count
        });
    },
    /*
    * 发布留言
    * */
    publishMessage: async (req, res) => {
        const {id, messageCon, articleTitle} = reqBody(req);
        const clientIp = getClientIp(req);
        let sql = `INSERT INTO message(articleId,articleTitle,msgCon,status,createTime,ip) VALUES(?,?,?,?,now(),?) `;
        const data = await dbquery(sql, [id, articleTitle, messageCon, 0, clientIp]);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.json({code: 200, msg: '留言成功'});
    }
};
