/* 逻辑处理模块 */
const regFunction = async (req, res, nickName, pwd, email, _sql) => {
    // 判断当前用户名是否已被注册
    const chargeIsReg = await dbquery(sql.checkUser, [nickName]);
    if (chargeIsReg.code !== 200) {
        res.json(chargeIsReg);
        return false;
    }
    const {result} = chargeIsReg;
    if (result.length > 0) {
        res.json({code: 9, msg: '用户已存在'});
        return false;
    }
    // 进行注册入库
    const reg_data = await dbquery(_sql, [nickName, pwd, email]);
    if (reg_data.code !== 200) {
        res.json(reg_data);
        return false;
    }
    req.session.user = nickName;
    res.json({ode: 200, msg: '注册成功'});
};
module.exports = {
    register: async (req, res) => {
        /*
         * regType 0:图片验证 1:邮箱验证
         * */
        const {nickName, passWord, email = null, img, emailCode, regType = 0} = reqBody(req);
        const pwd = hash('node' + passWord.toUpperCase() + 'reg', 'md5');
        const _sql = `insert into user_main(nickName,regTime,passWord,email) values(?,now(),?,?)`;
        if (nickName === undefined || nickName === '') {
            res.json({code: 1, msg: '用户名为空'});
        } else if (passWord === '') {
            res.json({code: 2, msg: '密码为空'});
        } else if (Number(regType) === 0) {
            if (img === undefined || img.trim() === '') {
                res.json({code: 4, msg: '图片验证码为空'});
            } else if (req.session.img !== img) {
                res.json({code: 5, msg: '图片验证码不正确'});
            } else {
                delete req.session.img;
                await regFunction(req, res, nickName, pwd, email, _sql);
            }
        } else if (Number(regType) === 1) {
            const redisMail = await redisDb.get(0, `${email}`);
            if (!redisMail) {
                res.json({code: 6, msg: '请先发送邮件验证码'});
            } else if (emailCode === undefined || emailCode.trim() === '') {
                res.json({code: 7, msg: '邮箱验证码为空'});
            } else if (emailCode !== redisMail) {
                res.json({code: 8, msg: '邮箱验证码不正确'});
            } else {
                await regFunction(req, res, nickName, pwd, email, _sql);
            }
        }
    }
};

