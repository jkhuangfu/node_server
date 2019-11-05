const router = require('koa-router')();
const {register} = require('../src/dao/user/register');
const {login} = require('../src/dao/user/login');
const {changePwd} = require('../src/dao/user/changePwd');
const check_login = require('../middlewares/checklogin');
const {changeUserAvatar} = require('../src/dao/user/changeUserAvatar');
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
        delete ctx.session;
        ctx.body = {code: flag ? 200 : 400};
    })
    .post('/checkLogin', async ctx => {
        const {user = null} = ctx.session;
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
