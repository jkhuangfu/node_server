const log4 = require('../../../log4/log4').log;
/* 逻辑处理模块 */
const user = {}; //存放用户信息
module.exports = {
    login: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let param = req.body; //post
        if (param.nickName === undefined || param.nickName === '') {
            jsonWrite(res, { code: 1, msg: '用户名为空' });
            log4.Info({ code: 1, msg: '用户名为空' });
        } else if (param.passWord === undefined || param.passWord === '') {
            jsonWrite(res, { code: 2, msg: '密码为空' });
            log4.Info({ code: 2, msg: '密码为空' });
        } else if (param.img === undefined || param.img === '') {
            jsonWrite(res, { code: 4, msg: '验证码为空' });
            log4.Info({ code: 4, msg: '验证码为空' });
        } else if (param.img != req.session.img) {
            jsonWrite(res, { code: 0, msg: '验证码不正确' });
            log4.Info({ code: 0, msg: '验证码不正确' });
        } else {
            pool.getConnection((err, connection) => {
                connection.query(sql.queryUserPwdByNickName, [param.nickName], (err, result) => {
                    if (result.length == 0) {
                        result = { code: 5, msg: '用户名或密码错误' };
                        log4.Info('用户名不存在');
                    } else if (result[0].passWord.toLowerCase() != param.passWord.toLowerCase() || result.length == 0) {
                        result = { code: 5, msg: '用户名或密码错误' };
                        log4.Info({ code: 5, msg: '用户名或密码错误' });
                    } else {
                        delete req.session.img;
                        user.userName = param.nickName;
                        req.session.user = user;
                        result = { code: 6, msg: '登录成功' };
                        log4.Info({ code: 6, msg: '登录成功,用户名为:-->' + param.nickName });
                    };
                    jsonWrite(res, result);
                    connection.release();
                });
            });
        };
    }
};