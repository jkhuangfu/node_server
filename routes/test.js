const router = require('koa-router')();
// koa-routerconst md5 = require('md5');
// const sha1 = require('sha1');
const {hash} = require('../util/inedx');
router
    .get('/', async (ctx, next) => {
        // captcha(ctx, next);
        // console.log(ctx.session)
        console.log(ctx.session)
        const res = {
            md5: {
                // omd5: md5('1234'),
                hmd5: hash('1234', 'md5')
            },
            sha1: {
                // osha1: sha1('1234'),
                hsha1:hash('1234','sha1')
            }
        };
        ctx.body = res;
    })

    .post('/post', ctx => {
        //设置 session
        console.log(ctx.request.body)
        ctx.session.test = Date.now();
        ctx.body = {
            code: 200,
            msg: 'post success'
        }
    });

module.exports = router.routes();
