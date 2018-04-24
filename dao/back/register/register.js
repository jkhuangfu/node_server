/* 逻辑处理模块 */
module.exports = {
    register: (req, res, next) => {
        const user = {}; //存放用户信息
        //let param = req.query || req.params; //get请求
        let pram = req.body; //post
        if (param.nickName === undefined || param.nickName === '') {
            result = {
                code: 1,
                msg: '用户名为空'
            };
            jsonWrite(res, result);
        } else if (param.passWord === undefined || param.passWord === '') {
            result = {
                code: 2,
                msg: '密码为空'
            };
            jsonWrite(res, result);
        } else if (param.img === '' || param.img === undefined) {
            jsonWrite(res, { code: 3, msg: '验证码为空' });
        } else if (param.img !== req.session.img && param.img !== '') {
            jsonWrite(res, { code: 0, msg: '验证码不正确' });
        } else {
            pool.getConnection((err, connection) => {
                connection.query(sql.checkUser, [param.nickName], (err, result) => {
                    if (result.length > 0) {
                        jsonWrite(res, { code: 4, msg: '已存在' });
                    } else {
                        pool.getConnection((err, connection) => {
                            connection.query(sql.insert, [param.nickName, param.passWord], (err, result) => {
                                if (result) {
                                    user.userName = param.nickName;
                                    req.session.user = user;
                                    result = { code: 200, msg: '注册成功' };
                                };
                                jsonWrite(res, result);
                            });
                        });
                    };
                    connection.release();
                })
            });
        };
    }
};