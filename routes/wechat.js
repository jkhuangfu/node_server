const router = require('koa-router')();
const {signature} = require('../src/dao/wechat/wx_signature/signature');
const {getOpenid} = require('../src/dao/wechat/wx_opnid/index');

router
    //微信分享获取签名
    .post('/wx_signature', async ctx => {
        console.log('======发送微信签名=====');
        await signature(ctx);
    })
    //获取微信 openid
    .post('/wx_openid', async ctx => {
        console.log('======发送微信openid=====');
        await getOpenid(ctx);
    });

module.exports = router.routes();
