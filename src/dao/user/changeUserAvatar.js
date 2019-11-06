module.exports = {
    changeUserAvatar: async (req, res) => {
        const {avatar} = reqBody(req);
        const sql = `update user_main set avatar = ? where nickName = ?`;
        if (!avatar) {
            res.json({code: 300, msg: '请传入头像地址'});
            return false;
        }
        const data = await dbquery(sql, [avatar, req.session.user.nickName]);
        if (data.code !== 200) {
            res.json(data);
            return false;
        }
        res.json({code: 200, msg: '修改成功'});
    }
};
