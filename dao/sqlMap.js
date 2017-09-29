/* sql语句 */
var sqlMap = {
    insert: 'insert into user_main(nickName,regTime,passWord) values(?,now(),?)', //注册
    queryUserPwdByNickName: 'SELECT passWord FROM user_main WHERE nickName = ?', //根据用户名查询密码
    changePassWord: 'UPDATE user_main SET passWord = ? WHERE nickName = ?', //修改密码
};
module.exports = sqlMap;