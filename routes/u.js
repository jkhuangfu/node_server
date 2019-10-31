const router = require('koa-router')();
const { getClientIp } = require('../src/util/inedx');
const captcha = require('../src/dao/common/cacp');
router.get('/', async (ctx, next) => {
    captcha(ctx, next);
    // await ctx.render('index')
});

router.get('/post', ctx => {
    //设置 session
    ctx.session.test = Date.now();
    ctx.body = {
        code: 200,
        msg: 'post success'
    }
});

module.exports = router.routes();
