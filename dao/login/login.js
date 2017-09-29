let common = require('../common/common');
common.ctrlCommon();
/* 逻辑处理模块 */
const user = {}; //存放用户信息
module.exports = {
    login: (req, res, next) => {
        let param = req.query || req.params; //get请求
        //let pram = req.body; //post
        if (param.nickName === undefined || param.nickName === '') {
            jsonWrite(res, { code: 1, msg: '用户名为空' });
        } else if (param.passWord === undefined || param.passWord === '') {
            jsonWrite(res, { code: 2, msg: '密码为空' });
        } else if (param.img === undefined || param.img === '') {
            jsonWrite(res, { code: 4, msg: '验证码为空' });
        } else if (param.img != req.session.img) {
            jsonWrite(res, { code: 0, msg: '验证码不正确' });
        } else {
            pool.getConnection((err, connection) => {
                connection.query(sql.queryUserPwdByNickName, [param.nickName], (err, result) => {
                    console.log(result)
                    if (result.length == 0) {
                        result = { code: 3, msg: '用户名不存在' }
                    } else if (result[0].passWord != param.passWord) {
                        result = { code: 5, msg: '用户名或密码错误' }
                    } else {
                        delete req.session.img;
                        user.userName = param.nickName;
                        req.session.user = user;
                        result = { code: 5, msg: '登录成功' };
                    };
                    jsonWrite(res, result);
                    connection.release();
                });
            });
        };
    }
};