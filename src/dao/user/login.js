/* 逻辑处理模块 */
const user = {}; //存放用户信息
module.exports = {
    login: (req, res) => {
        let { nickName,passWord,img } = reqBody(req);
        if (nickName === undefined || nickName === '') {
            writeResponse(res,1,'用户名为空');
            res.json({ code: 1, msg: '用户名为空' });
            log4.Info({ code: 1, msg: '用户名为空' });
        } else if (passWord === undefined || passWord === '') {
            res.json({ code: 2, msg: '密码为空' });
            log4.Info({ code: 2, msg: '密码为空' });
        } else if (img === undefined || img === '') {
            res.json({ code: 4, msg: '验证码为空' });
            log4.Info({ code: 4, msg: '验证码为空' });
        } else if (img !== req.session.img) {
            res.json({ code: 0, msg: '验证码不正确' });
            log4.Info({ code: 0, msg: '验证码不正确' });
        } else {
            let json ;
            pool.getConnection((err, connection) => {
                if(err){
                    res.json({code:500,msg:'数据库连接异常',err});
                    return false;
                }
                try{
                    connection.query(sql.queryUserPwdByNickName, [nickName], (err, result) => {
                        if(err){
                            json = { code: 500, msg: err };
                        }else if (result.length === 0 || (result[0].passWord && result[0].passWord !== md5('node'+passWord.toUpperCase()+'reg'))) {
                            json = { code: 5, msg: '用户名或密码错误' };
                            log4.Info({ code: 5, msg: '用户名或密码错误' });
                        } else {
                            delete req.session.img;
                            req.session.user = result[0];
                            let { nickName, avatar } = result[0];
                            let data = { nickName, avatar } ;
                            json = { code: 6, msg: '登录成功',data};
                            log4.Info({ code: 6, msg: '登录成功,用户名为:-->' + nickName });
                        }
                        res.json(json);
                        connection.release();
                    });
                }catch (e) {
                    res.json({code:500,msg:'登录失败',err});
                }
            });
        }
    }
};
