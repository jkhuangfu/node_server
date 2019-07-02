/* 逻辑处理模块 */
module.exports = {
    register: (req, res, next) => {
        const user = {}; //存放用户信息
        //let param = req.query || req.params; //get请求
        let { nickName,passWord,img } = req.body; //post
        if (nickName === undefined || nickName === '') {
            result = {
                code: 1,
                msg: '用户名为空'
            };
            jsonWrite(res, result);
        } else if (passWord === undefined || passWord === '') {
            result = {
                code: 2,
                msg: '密码为空'
            };
            jsonWrite(res, result);
        } else if (img === '' || img === undefined) {
            jsonWrite(res, { code: 3, msg: '验证码为空' });
        } else if (img !== req.session.img && img !== '') {
            jsonWrite(res, { code: 0, msg: '验证码不正确' });
        } else {
            pool.getConnection((err, connection) => {
                connection.query(sql.checkUser, [nickName], (err, result) => {
                    if (result.length > 0) {
                        jsonWrite(res, { code: 4, msg: '已存在' });
                    } else {
                        pool.getConnection((err, connection) => {
                            connection.query(sql.insert, [nickName, md5('node'+passWord.toUpperCase()+'reg')], (err, result) => {
                                if (result) {
                                    user.userName = nickName;
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