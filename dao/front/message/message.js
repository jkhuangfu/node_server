/*
 *@DEC 留言 Module
 */
const qs = require('qs');
const log4 = require('../../../log4/log4').log;
module.exports = {
    queryMessageByArticleId: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let { id } = req.body; //post
        if (!id) {
            jsonWrite(res, { code: 4, message: '参数异常' });
            return;
        };
        let sql = 'SELECT * FROM message WHERE articleId = ' + id;
        pool.getConnection((err, connection) => {
            if (err) {
                throw new Error(err);
                log4.Warn(err);
                jsonWrite(res, { code: 500, message: '数据库连接异常1' });
                return flase;
            };
            connection.query(sql, (err, response) => {
                if (err) {
                    throw new Error(err);
                    log4.Warn(err);
                    jsonWrite(res, { code: 500, message: '数据库连接异常2' });
                    return flase;
                };
                jsonWrite(res, { code: 200, messageList: response });
                connection.release();
            });
        });
    },
    postMsg: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let { articleId,articleTitle,msgCon,nickName } = req.body; //post
        let insertData = [articleId, articleTitle, msgCon, nickName];
        log4.Info('传递数据===' + insertData);
        if (insertData.indexOf(undefined) >= 0) {
            jsonWrite(res, { code: 500, message: '参数异常' });
            return;
        }
        let sql = 'INSERT INTO message (articleId,articleTitle,msgCon,nickName,createTime) values (?,?,?,?,now())';
        pool.getConnection((err, connection) => {
            if (err) {
                throw new Error(err);
                log4.Warn(err);
                jsonWrite(res, { code: 500, message: '数据库连接异常1' });
                return false;
            }
            connection.query(sql, insertData, (err, response) => {
                if (err) {
                    throw new Error(err);
                    log4.Warn(err);
                    jsonWrite(res, { code: 500, message: err });
                    return false;
                };
                jsonWrite(res, { code: 200, message: '留言成功' });
                connection.release();
            });
        });
    }
}