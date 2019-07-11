/* 逻辑处理模块 */
const user = {}; //存放用户信息
module.exports = {
    login: (req, res) => {
        //let param = req.query || req.params; //get请求
        let { nickName,passWord,img } = req.body; //post
        if (nickName === undefined || nickName === '') {
            res.json({ code: 1, msg: '用户名为空' });
            log4.Info({ code: 1, msg: '用户名为空' });
        } else if (passWord === undefined || passWord === '') {
            res.json({ code: 2, msg: '密码为空' });
            log4.Info({ code: 2, msg: '密码为空' });
        } else if (img === undefined || img === '') {
            res.json({ code: 4, msg: '验证码为空' });
            log4.Info({ code: 4, msg: '验证码为空' });
        } else if (img !== req.session.img) {
            res.json({ code: 0, msg: '验证码不正确' });
            log4.Info({ code: 0, msg: '验证码不正确' });
        } else {
            let json ;
            pool.getConnection((err, connection) => {
                connection.query(sql.queryUserPwdByNickName, [nickName], (err, result) => {
                    if (result[0].passWord !== md5('node'+passWord.toUpperCase()+'reg') || result.length === 0) {
                        json = { code: 5, msg: '用户名或密码错误' };
                        log4.Info({ code: 5, msg: '用户名或密码错误' });
                    } else {
                        delete req.session.img;
                        user.userName = nickName;
                        req.session.user = user;
                        json = { code: 6, msg: '登录成功' };
                        log4.Info({ code: 6, msg: '登录成功,用户名为:-->' + nickName });
                    }
                    res.json(json);
                    connection.release();
                });
            });
        }
    }
};
