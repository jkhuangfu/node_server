const router = require('koa-router')();
const {register} = require('../models/user/register');
const {login} = require('../models/user/login');
const {changePwd} = require('../models/user/changePwd');
const check_login = require('../middlewares/checklogin');
const {changeUserAvatar} = require('../models/user/changeUserAvatar');
router
    .post('/reg', async ctx => {
        console.log('====进入注册流程====');
        await register(ctx);
    })
    .post('/login', async (ctx,next) => {
        console.log('====进入登陆流程====');
        await login(ctx,next);
    })
    .post('/logout', async ctx => {
        console.log('======退出登录=====');
        // const flag = await redisDb.del('dr_net' + ctx.sessionID);
        ctx.session = null;
        ctx.body = {code:  200 };
    })
    .post('/checkLogin', async ctx => {
        const {user = null} = ctx.session;
        console.log(ctx.session)
        ctx.body = {code: user ? 200 : 401};
    })
    .use(check_login)
    .post('/changePassword', async ctx => {
        console.log('====进入修改密码流程====');
        await changePwd(ctx);
    })
    .post('/changeUserAvatar', async ctx => {
        console.log('====进入修改头像流程====');
        await changeUserAvatar(ctx);
    });

module.exports = router.routes();
