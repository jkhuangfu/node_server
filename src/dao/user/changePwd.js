module.exports = {
    /*
        oldPassWord : user old awd
        newPassWord: user new pwd
        nickName : user name
        email : 注册邮箱
        emailCode: 邮箱验证码
    */
    changePwd: async (req, res) => {
        let { oldPassWord,newPassWord,email,emailCode } = reqBody(req);
        let { nickName } = req.session.user;
        if ( newPassWord === '' || oldPassWord === '' ) {
            res.json({ code: 1, message: '请输入新(旧)密码' });
            return false;
        }else if(email === ''){
            res.json({ code: 2, message: '请输入邮箱' });
            return false;
        }else if(emailCode === ''){
            res.json({ code: 3, message: '请输入邮箱验证码' });
            return false;
        }else if(email) {
            let redis_code = await redisDb.get(0,`${email}`);
            if(!redis_code){
                res.json({ code: 4, message: '请先发送验证码' });
                return  false;
            }else if(redis_code !== emailCode) {
                res.json({ code: 5, message: '验证码不正确' });
                return  false;
            }
        }

        pool.getConnection((err, connection) => {
            if (err) {
                res.json({ code: 500, message: '服务器错误', errorMsg: err });
            } else {
                connection.query(sql.queryUserPwdByNickName, [nickName], (err, result) => {
                    if (result) {
                        if (md5('node'+oldPassWord.toUpperCase()+'reg') === result[0].passWord) {
                            connection.query(sql.changePassWord, [md5('node'+newPassWord.toUpperCase()+'reg'), nickName], (err, result) => {
                                if (result) {
                                    res.json({ code: 200, message: '用户密码修改成功' });
                                }
                            });
                        } else {
                            res.json({code: 6, message: '旧密码不匹配' });
                        }
                    }
                    connection.release();
                });
            }
        });
    }
};
