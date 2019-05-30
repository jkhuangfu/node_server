const log4 = require('../../../log4/log4').log;
module.exports = {
    queryArticleById: (id, callback) => {
        let sql = 'SELECT * FROM article WHERE id = ' + id;
        pool.getConnection((err, connection) => {
            if (err) {
                throw new Error(err);
                log4.Warn(err);
                return false;
            };
            connection.query(sql, (err, response) => {
                if (err) {
                    throw new Error(err);
                    log4.Warn(err);
                    return false;
                };
                connection.release();
                callback(response)
            });
        });
    }
}