/**
 * @name checklogin
 * @description 检查用户是否登录的中间件
 * @return 401鉴权状态码
 */

module.exports = async (ctx, next) => {
    const isLogin = await redisDb.get('dr_net' + ctx.sessionID);
    if ((isLogin === null && ctx.method === 'POST') || (isLogin && !JSON.parse(isLogin).user && ctx.method === 'POST')) {
        return ctx.throw(401,'access_denied');
    }
    await next();
};
