module.exports = {
    changeUserAvatar: async ctx => {
        const {avatar} = reqBody(ctx);
        const sql = `update user_main set avatar = ? where nickName = ?`;
        if (!avatar) {
            ctx.body = {code: 300, msg: '请传入头像地址'};
            return false;
        }
        const data = await dbquery(sql, [avatar, ctx.session.user.nickName]);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        ctx.body = {code: 200, msg: '修改成功'};
    }
};
