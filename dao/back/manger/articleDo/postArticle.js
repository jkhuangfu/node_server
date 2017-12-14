/*
 *文章发布 Module 
 */
const log4 = require('../../../../log4/log4').log;
module.exports = {
    postArticle: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let param = req.body; //post
        let sql = 'INSERT INTO article(articleTitle,articleCon,createTime) values(?,?,now())';
        let insertData = [param.articleTitle, param.articleCon];
        if (insertData.length != 2) {
            log4.Warn('数据不全');
            jsonWrite(res, { code: 99, msg: '数据不全' });
            return;
        };
        pool.getConnection((err, connection) => {
            if (err) {
                log4.writeERR('发布信息出错信息====' + err);
                jsonWrite(res, { code: 9, msg: '数据库连接池出错' });
                return;
            };
            connection.query(sql, insertData, (err, response) => {
                if (err) {
                    log4.writeErr('发布文章出错信息====' + err);
                    jsonWrite(res, { code: 0, msg: '发布信息出错' });
                    connection.release();
                    return;
                };
                jsonWrite(res, { code: 1, msg: '发布成功' })
                connection.release();
            })
        })
    }
}