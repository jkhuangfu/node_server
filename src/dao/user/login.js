/* 逻辑处理模块 */
module.exports = {
    login: async (ctx, next) => {
        let { nickName, passWord, img } = reqBody(ctx);
        if (nickName === undefined || nickName === '') {
            ctx.body = { code: 1, msg: '用户名为空' };
            log4.Info({ code: 1, msg: '用户名为空' });
            return false;
        } else if (passWord === undefined || passWord === '') {
            ctx.body = { code: 2, msg: '密码为空' };
            log4.Info({ code: 2, msg: '密码为空' });
            return false;
        } else if (img === undefined || img === '') {
            ctx.body = { code: 4, msg: '验证码为空' };
            log4.Info({ code: 4, msg: '验证码为空' });
            return false;
        } else if (img !== ctx.session.img) {
            ctx.body = { code: 0, msg: '验证码不正确' };
            log4.Info({ code: 0, msg: '验证码不正确' });
            return false;
        }
        const data = await dbquery(sql.queryUserPwdByNickName, [nickName]);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        const { result } = data;
        const md5_pwd = hash('node' + passWord.toUpperCase() + 'reg', 'md5');
        if (result.length === 0 || (result[0].passWord && result[0].passWord !== md5_pwd)) {
            ctx.body = { code: 5, msg: '用户名或密码错误' };
            log4.Info({ code: 5, msg: '用户名或密码错误' });
            return false;
        }
        delete ctx.session.img;
        ctx.session.user = { nickName: result[0].nickName };
        const { avatar } = result[0];
        const res = { nickName, avatar };
        ctx.body = { code: 6, msg: '登录成功', res };
        log4.Info({ code: 6, msg: '登录成功,用户名为:-->' + nickName });
    }
};
