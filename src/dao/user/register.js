/* 逻辑处理模块 */
module.exports = {
    register: async(req, res) => {
        let user = {},json; //存放用户信息
        /*
        * regType 0:图片验证 1:邮箱验证
        * */
        let { nickName,passWord,email,img,emailCode,regType } = reqBody(req); //post
        if (nickName === undefined || nickName === '') {
            json = {code: 1, msg: '用户名为空'};
        } else if (passWord === undefined || passWord === '') {
            json = {code: 2, msg: '密码为空'};
        } else if (email === undefined || email === '') {
            json = { code: 3, msg: '邮箱为空' };
        }else if(regType===0){
            if(img === undefined || img.trim() === ''){
                json = { code: 4, msg: '图片验证码为空' };
            }else if(req.session.img !== img){
                json = { code: 5, msg: '图片验证码不正确' };
            }
        }else if(regType===1){
            let redisMail = await redisDb.get(0,`${email}`);
            if(!redisMail){
                json = { code: 6, msg: '请先发送邮件验证码'};
            }else if(emailCode === undefined || emailCode.trim() === ''){
                json = { code: 7, msg: '邮箱验证码为空' };
            }else if(emailCode !== redisMail){
                json = { code: 8, msg: '邮箱验证码不正确' };
            }
        } else {
            pool.getConnection((err, connection) => {
                connection.query(sql.checkUser, [email], (err, result) => {
                    if (result.length > 0) {
                        json = { code: 9, msg: '用户已存在' };
                    } else {
                        pool.getConnection((err, connection) => {
                            connection.query(sql.insert, [nickName, md5('node'+passWord.toUpperCase()+'reg'),email], (err, result) => {
                                if (result) {
                                    user.userName = nickName;
                                    req.session.user = user;
                                    json = { code: 200, msg: '注册成功' };
                                }
                            });
                        });
                    }
                    connection.release();
                })
            });
        }
        res.json(json);
    }
};