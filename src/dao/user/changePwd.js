module.exports = {
    /*
        oldPassWord : user old awd
        newPassWord: user new pwd
        nickName : user name
        email : 注册邮箱
        emailCode: 邮箱验证码
    */
    changePwd: async (req, res) => {
        const {oldPassWord, newPassWord, email, emailCode} = reqBody(req);
        const {nickName} = req.session.user;
        const sql = 'SELECT passWord FROM user_main WHERE nickName = ?';
        const changePwdSql = 'UPDATE user_main SET passWord = ? WHERE nickName = ?';
        if (newPassWord === '' || oldPassWord === '') {
            res.json({code: 1, message: '请输入新(旧)密码'});
            return false;
        } else if (email === '') {
            res.json({code: 2, message: '请输入邮箱'});
            return false;
        } else if (emailCode === '') {
            res.json({code: 3, message: '请输入邮箱验证码'});
            return false;
        } else if (email) {
            let redis_code = await redisDb.get(`${email}`);
            if (!redis_code) {
                res.json({code: 4, message: '请先发送验证码'});
                return false;
            } else if (redis_code !== emailCode) {
                res.json({code: 5, message: '验证码不正确'});
                return false;
            }
        }
        // 验证旧密码是否正确
        const old_data = await dbquery(sql, [nickName]);
        if (old_data.code !== 200) {
            res.json(old_data);
            return false;
        }
        const {passWord} = old_data.result[0];
        const custom_pwd = hash('node' + oldPassWord.toUpperCase() + 'reg', 'md5');
        // 旧密码输入不正确
        if (passWord !== custom_pwd) {
            res.json({code: 6, message: '旧密码不匹配'});
            return false;
        }
        const change_res = await dbquery(changePwdSql, [
            hash('node' + newPassWord.toUpperCase() + 'reg', 'md5'),
            nickName
        ]);
        if (change_res.code !== 200) {
            res.json(change_res);
            return false;
        }
        await redisDb.del([email, `${email}_count`]);
        res.json({code: 200, message: '用户密码修改成功'});
    }
};
