/**
 * @name checklogin
 * @description 检查用户是否登录的中间件
 * @return 401鉴权状态码
 */

module.exports = (req,res,next)=>{
    if(!req.session.user && req.method === 'POST'){
        return res.send(401);
    }
    next();
};
