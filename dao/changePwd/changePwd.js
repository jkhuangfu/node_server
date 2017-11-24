/* const common = require('../common/common');
common.ctrlCommon(); */
module.exports = {
    /* 
        oldPwd : user old awd
        newPwd: user new pwd
        nickName : user name
    */
    changePwd: (req, res, next) => {
        let param = req.query || req.params; //get请求
        //let pram = req.body; //post
        let oldPwd = param.oldPwd;
        let newPwd = param.newPwd;
        let newPwdAgain = param.newPwdAgain;
        let nickName = req.session.user.userName;

        if (!nickName) {
            jsonWrite(res, { code: 99, message: 'session过期' });
            return;
        };
        if (!oldPwd || !newPwd || !newPwdAgain) {
            jsonWrite(res, { code: 1, message: '用户密码为空' });
            return;
        };
        if (newPwd != newPwdAgain) {
            jsonWrite(res, { code: 2, message: '两次密码不一致' });
            return;
        };
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err)
            } else {
                connection.query(sql.queryUserPwdByNickName, [nickName], (err, result) => {
                    if (result) {
                        if (oldPwd == result[0].passWord) {
                            connection.query(sql.changePassWord, [newPwd, nickName], (err, result) => {
                                if (result) {
                                    jsonWrite(res, { code: 3, message: '用户密码修改成功' });
                                    connection.release();
                                };
                            });
                        } else {
                            jsonWrite(res, { code: 4, message: '旧密码不匹配' });
                            connection.release();
                        };
                    };
                });
            };
        });
    }
};