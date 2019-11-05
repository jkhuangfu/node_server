/* 逻辑处理模块 */
const regFunction = async (ctx, nickName, pwd, email, _sql) => {
    // 判断当前用户名是否已被注册
    const chargeIsReg = await dbquery(sql.checkUser, [nickName]);
    if (chargeIsReg.code !== 200) {
        ctx.body = chargeIsReg;
        return false;
    }
    const {result} = chargeIsReg;
    if (result.length > 0) {
        ctx.body = {code: 9, msg: '用户已存在'};
        return false;
    }
    // 进行注册入库
    const reg_data = await dbquery(_sql, [nickName, pwd, email]);
    if (reg_data.code !== 200) {
        ctx.body = reg_data;
        return false;
    }
    ctx.session.user = nickName;
    ctx.body = {code: 200, msg: '注册成功'};
};
module.exports = {
    register: async ctx => {
        /*
         * regType 0:图片验证 1:邮箱验证
         * */
        let {nickName, passWord, email = null, img, emailCode, regType = 0} = reqBody(ctx);
        let pwd = hash('node' + passWord.toUpperCase() + 'reg', 'md5');
        let _sql = `insert into user_main(nickName,regTime,passWord,email) values(?,now(),?,?)`;
        if (nickName === undefined || nickName === '') {
            ctx.body = {code: 1, msg: '用户名为空'};
        } else if (passWord === '') {
            ctx.body = {code: 2, msg: '密码为空'};
        } else if (Number(regType) === 0) {
            if (img === undefined || img.trim() === '') {
                ctx.body = {code: 4, msg: '图片验证码为空'};
            } else if (ctx.session.img !== img) {
                ctx.body = {code: 5, msg: '图片验证码不正确'};
            } else {
                delete ctx.session.img;
                await regFunction(ctx, nickName, pwd, email, _sql);
            }
        } else if (Number(regType) === 1) {
            const redisMail = await redisDb.get(0, `${email}`);
            if (!redisMail) {
                ctx.body = {code: 6, msg: '请先发送邮件验证码'};
            } else if (emailCode === undefined || emailCode.trim() === '') {
                ctx.body = {code: 7, msg: '邮箱验证码为空'};
            } else if (emailCode !== redisMail) {
                ctx.body = {code: 8, msg: '邮箱验证码不正确'};
            } else {
                await regFunction(ctx, nickName, pwd, email, _sql);
            }
        }
    }
};
