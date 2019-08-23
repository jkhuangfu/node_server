/* 逻辑处理模块 */
const regFunction = (res, req, nickName, pwd, email, _sql) => {
    let user = {}; //存放用户信息
    pool.getConnection(async (err, connection) => {
        if (err) {
            res.json({code: 500, msg: '数据库连接失败', err});
            return false;
        }
        try {
            const hasReg = await new Promise(resolve => {
                connection.query(sql.checkUser, [nickName], (err, response) => {
                    let resCode = 200;
                    if (err) {
                        resCode = 404;
                        res.json({code: 500, msg: err});
                    } else if (response.length > 0) {
                        resCode = 404;
                        res.json({code: 9, msg: '用户已存在'});
                    }
                    resolve(resCode);
                })
            });
            if (hasReg === 200) {
                connection.query(_sql, [nickName, pwd, email], (err, result) => {
                    if (err) {
                        res.json({code: 500, msg: err});
                    } else if (result) {
                        user.userName = nickName;
                        req.session.user = user;
                        res.json({code: 200, msg: '注册成功'});
                    }
                    connection.release();
                });
            } else {
                connection.release();
            }
        } catch (e) {
            res.json({code: 500, msg: '注册程序出错', e})
        }
    });
};
module.exports = {
    register: async (req, res) => {
        /*
        * regType 0:图片验证 1:邮箱验证
        * */
        let {nickName, passWord, email = null, img, emailCode, regType} = reqBody(req);
        let pwd = md5('node' + passWord.toUpperCase() + 'reg');
        let _sql = `insert into user_main(nickName,regTime,passWord,email) values(?,now(),?,?)`;
        if (nickName === undefined || nickName === '') {
            res.json({code: 1, msg: '用户名为空'});
        } else if (passWord === undefined || passWord === '') {
            res.json({code: 2, msg: '密码为空'});
        } else if (regType == 0) {
            if (img === undefined || img.trim() === '') {
                res.json({code: 4, msg: '图片验证码为空'});
            } else if (req.session.img !== img) {
                res.json({code: 5, msg: '图片验证码不正确'});
            } else {
                delete req.session.img;
                regFunction(res, req, nickName, pwd, email, _sql);
            }
        } else if (regType == 1) {
            let redisMail = await redisDb.get(0, `${email}`);
            if (!redisMail) {
                res.json({code: 6, msg: '请先发送邮件验证码'});
            } else if (emailCode === undefined || emailCode.trim() === '') {
                res.json({code: 7, msg: '邮箱验证码为空'});
            } else if (emailCode !== redisMail) {
                res.json({code: 8, msg: '邮箱验证码不正确'});
            } else {
                regFunction(res, req, nickName, pwd, email, _sql);
            }
        }
    }
};
