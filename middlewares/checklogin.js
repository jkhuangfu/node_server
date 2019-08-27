/**
 * @name checklogin
 * @description 检查用户是否登录的中间件
 * @return 401鉴权状态码
 */

module.exports = async (req, res, next) => {
    const isLogin = await redisDb.get('drnet' + req.sessionID);
    if (isLogin && !JSON.parse(isLogin).user && req.method === 'POST') {
        return res.status(401).end();
    }
    next();
};
