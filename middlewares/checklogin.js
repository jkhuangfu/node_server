/**
 * @name checklogin
 * @description 检查用户是否登录的中间件
 * @return 401鉴权状态码
 */

module.exports = async (ctx, next) => {
    const {user} = ctx.session;
    if (ctx.method === 'POST' && !user) {
        ctx.throw(401, 'access_denied');
    }
    await next();
};
