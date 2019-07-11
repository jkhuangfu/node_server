/* 逻辑处理模块 */
module.exports = {
    register: (req, res) => {
        let user = {},json; //存放用户信息
        //let param = req.query || req.params; //get请求
        let { nickName,passWord,email,img } = req.body; //post
        if (nickName === undefined || nickName === '') {
            json = {
                code: 1,
                msg: '用户名为空'
            };

        } else if (passWord === undefined || passWord === '') {
            json = {
                code: 2,
                msg: '密码为空'
            };
        } else if (img === '' || img === undefined) {
            json = { code: 3, msg: '验证码为空' };
        } else if (img !== req.session.img && img !== '') {
            json = { code: 0, msg: '验证码不正确' };
        }else if (email === undefined || email === '') {
            json = { code: 5, msg: '邮箱为空' };
        } else {
            pool.getConnection((err, connection) => {
                connection.query(sql.checkUser, [nickName], (err, result) => {
                    if (result.length > 0) {
                        json = { code: 4, msg: '用户名已存在' };
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