module.exports = {
    /*
        oldPwd : user old awd
        newPwd: user new pwd
        nickName : user name
        emailCode: 邮箱验证码
    */
    changePwd: async(req, res, next) => {
        //let param = req.query || req.params; //get请求
        let { oldPwd,newPwd,email,emailCode } = req.body; //post
        let redisMail = await redisDb.get(0,`${email}`);
        let { nickName } = req.session.user;
        if (!nickName) {
            res.json({ code: 99, message: 'session过期' });
            return;
        }
        if (!oldPwd || !newPwd ) {
            res.json({ code: 1, message: '用户密码为空' });
            return;
        }
        if(!redisMail){
            res.json({ code: 4, message: '请先发送验证码' });
            return;
        }
        if(redisMail !== emailCode){
            res.json({code:5,message:'邮箱验证码不正确'})
        }
        pool.getConnection((err, connection) => {
            if (err) {
                jsonWrite(res, { code: 500, message: '服务器错误', errorMsg: err });
            } else {
                connection.query(sql.queryUserPwdByNickName, [nickName], (err, result) => {
                    if (result) {
                        if (md5('node'+oldPwd.toUpperCase()+'reg') === result[0].passWord) {
                            connection.query(sql.changePassWord, [md5('node'+newPwd.toUpperCase()+'reg'), nickName], (err, result) => {
                                if (result) {
                                    res.json({ code: 200, message: '用户密码修改成功' });
                                }
                            });
                        } else {
                            res.json({code: 4, message: '旧密码不匹配' });
                        }
                    }
                    connection.release();
                });
            };
        });
    }
};