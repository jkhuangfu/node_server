module.exports = {
    /*
          oldPassWord : user old awd
          newPassWord: user new pwd
          nickName : user name
          email : 注册邮箱
          emailCode: 邮箱验证码
      */
    changePwd: async ctx => {
        const {oldPassWord, newPassWord, email, emailCode} = reqBody(ctx);
        const {nickName} = ctx.session.user;
        if (newPassWord === '' || oldPassWord === '') {
            ctx.body = {code: 1, message: '请输入新(旧)密码'};
            return false;
        } else if (email === '') {
            ctx.body = {code: 2, message: '请输入邮箱'};
            return false;
        } else if (emailCode === '') {
            ctx.body = {code: 3, message: '请输入邮箱验证码'};
            return false;
        } else if (email) {
            let redis_code = await redisDb.get(`${email}`);
            if (!redis_code) {
                ctx.body = {code: 4, message: '请先发送验证码'};
                return false;
            } else if (redis_code !== emailCode) {
                ctx.body = {code: 5, message: '验证码不正确'};
                return false;
            }
        }
        // 验证旧密码是否正确
        const old_data = dbquery(sql.queryUserPwdByNickName, [nickName]);
        if (old_data.code !== 200) {
            ctx.body = old_data;
            return false;
        }
        const {passWord} = old_data.result[0];
        const custom_pwd = hash('node' + oldPassWord.toUpperCase() + 'reg', 'md5');
        // 旧密码输入不正确
        if (passWord !== custom_pwd) {
            ctx.body = {code: 6, message: '旧密码不匹配'};
            return false;
        }
        const change_res = await dbquery(sql.changePassWord, [
            hash('node' + newPassWord.toUpperCase() + 'reg', 'md5'),
            nickName
        ]);
        if (change_res.code !== 200) {
            ctx.body = change_res;
            return false;
        }
        await redisDb.del([email, `${email}_count`]);
        ctx.body = {code: 200, message: '用户密码修改成功'};
    }
};
