const router = require('koa-router')();
const {getClientIp} = require('../src/util/inedx');
const captcha = require('../src/dao/common/cacp');
router
    .get('/', async (ctx, next) => {
        captcha(ctx, next);
        console.log(ctx.session)
        // await ctx.render('index')
    })

    .post('/post', ctx => {
        //设置 session
        console.log(reqBody(ctx));
        ctx.session.test = Date.now();
        ctx.body = {
            code: 200,
            msg: 'post success'
        }
    });

module.exports = router.routes();
