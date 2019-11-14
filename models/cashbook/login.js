module.exports = async (req, res) => {
    const {nickName, passWord, code} = reqBody(req);
    const sql = 'SELECT user_openid,pass_word FROM cash_user WHERE user_name = ?';
    if (nickName === undefined || nickName === '') {
        res.json({code: 1, msg: '用户名为空'});
        log4.Info({code: 1, msg: '用户名为空'});
        return false;
    } else if (passWord === undefined || passWord === '') {
        res.json({code: 2, msg: '密码为空'});
        log4.Info({code: 2, msg: '密码为空'});
        return false;
    } else if (code === undefined || code === '') {
        res.json({code: 4, msg: '验证码为空'});
        log4.Info({code: 4, msg: '验证码为空'});
        return false;
    }
    // 验证验证码是否正确（查看session中是否存在对应用户名对应的user_openid,并从中获取code）
    let data = await dbquery(sql, [nickName]);
    if (data.code !== 200) {
        res.json(data);
        return false;
    }
    data = data.result;
    // 用户不存在
    if (data.length === 0) {
        res.json({code: 100, msg: '请检查您填写的用户信息'});
        log4.Info({code: 100, msg: '用户名不存在'});
        return false;
    }
    // 用户名对进行校验微信验证码和密码
    const {user_openid, pass_word} = data[0];
    const wx_code = await redisDb.get(user_openid+'_code');
    const md5_pwd = hash('node' + passWord.toUpperCase() + 'reg', 'md5');
    if (code !== wx_code) {
        res.json({code: 101, msg: '验证码不正确'});
        log4.Info({code: 102, msg: '验证码不正确'});
        return false;
    }
    if (md5_pwd !== pass_word) {
        res.json({code: 103, msg: '请检查您填写的用户信息'});
        log4.Info({code: 103, msg: '密码不正确'});
        return false;
    }
    await redisDb.del(user_openid+'_code');
    req.session.user = {nickName: nickName};
    res.json({code: 200, msg: '登录成功', data: nickName});
    log4.Info({code: 200, msg: '登录成功,用户名为:-->' + nickName});
};

