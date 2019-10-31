/**
 * @name checklogin
 * @description 检查用户是否登录的中间件
 * @return 401鉴权状态码
 */

module.exports = async (ctx, next) => {
    // // const isLogin = await redisDb.get('dr_net' + req.sessionID);
    // if ((isLogin === null && req.method === 'POST') || (isLogin && !JSON.parse(isLogin).user && req.method === 'POST')) {
    //     return ctx.throw(401,'access_denied', { user: 111 });
    // }
    next();
};
