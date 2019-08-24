module.exports = {
    changeUserAvatar:(req,res)=>{
        const { avatar } = reqBody(req);
        const sql = `update user_main set avatar = ? where nickName = ?`;
        if(avatar){
            pool.getConnection((err,connection)=>{
                if(err){
                    res.json({code:500,msg:'数据库连接失败',err});
                    return false;
                }
                try{
                    connection.query(sql,[avatar,req.session.user.nickName],(err,response)=>{
                        if(err){
                            res.json({code:500,msg:'头像修改程序错误',err});
                            connection.release();
                            return false;
                        }
                        console.log(response)
                        res.json({code:200,msg:'修改成功'});
                        connection.release();
                    })
                }catch(e){
                    res.json({code:500,msg:'头像修改程序错误',e});
                }
            })
        }else {
            res.json({code:300,msg:'请传入头像地址'})
        }
    }
};