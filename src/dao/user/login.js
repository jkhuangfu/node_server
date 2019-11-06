/* 逻辑处理模块 */
module.exports = {
    login: async (req, res) => {
        const { nickName,passWord,img } = reqBody(req);
        if (nickName === undefined || nickName === '') {
            res.json({ code: 1, msg: '用户名为空' });
            log4.Info({ code: 1, msg: '用户名为空' });
            return false;
        } else if (passWord === undefined || passWord === '') {
            res.json({ code: 2, msg: '密码为空' });
            log4.Info({ code: 2, msg: '密码为空' });
            return false;
        } else if (img === undefined || img === '') {
            res.json({ code: 4, msg: '验证码为空' });
            log4.Info({ code: 4, msg: '验证码为空' });
            return false;
        } else if (img !== req.session.img) {
            res.json({ code: 0, msg: '验证码不正确' });
            log4.Info({ code: 0, msg: '验证码不正确' });
            return false;
        }
        const data = await dbquery(sql.queryUserPwdByNickName, [nickName]);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        const { result } = data;
        const md5_pwd = hash('node' + passWord.toUpperCase() + 'reg', 'md5');
        if (result.length === 0 || (result[0].passWord && result[0].passWord !== md5_pwd)) {
            res.json({ code: 5, msg: '用户名或密码错误' });
            log4.Info({ code: 5, msg: '用户名或密码错误' });
            return false;
        }
        delete req.session.img;
        req.session.user = { nickName: result[0].nickName };
        const { avatar } = result[0];
        const response = { nickName, avatar };
        res.json({ code: 6, msg: '登录成功', response });
        log4.Info({ code: 6, msg: '登录成功,用户名为:-->' + nickName });

    }
};
