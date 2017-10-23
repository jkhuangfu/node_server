/* sql语句 */
let sqlMap = {
    insert: 'insert into user_main(nickName,regTime,passWord) values(?,now(),?)', //注册
    queryUserPwdByNickName: 'SELECT passWord FROM user_main WHERE nickName = ?', //根据用户名查询密码
    changePassWord: 'UPDATE user_main SET passWord = ? WHERE nickName = ?', //修改密码
    publishMessage: 'insert into message(msgCon,nickName,createTime,status) values(?,now(),?,?)', //发布信息
    showMessage: 'update message set status = ? where id = ?', //是否显示
    deleteMessage: 'delete from message where id = ?', //删除信息
    queryShowMessage: 'select * from message where status = 1 order by `createTime` desc', //按照时间倒序获取要显示信息
    queryAllMessage: 'select * from `message` order by `createTime` desc', //按照时间倒序获取所有信息
};
module.exports = sqlMap;