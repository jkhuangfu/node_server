const router = require('koa-router')();
const checklogin = require('../middlewares/checklogin');
const captcha = require('../models/common/cacp');
const {upFileForOss, upFileForLocal} = require('../models/common/upFile');
const {sendMailCode, sendMailNormal} = require('../models/common/sendMail');

const checkFile = async ctx => {
    if (!ctx.request.files) {
        ctx.body = {status: 400, msg: '未上传文件'};
        return false;
    }
    if ((Object.keys(ctx.request.files.file).length === 0)) {
        ctx.body = {status: 401, msg: '未上传文件'};
        return false;
    }
    return true;
};

router
    .use(checklogin)
    .get('/captcha', async ctx => {
        await captcha(ctx);
    })
    .post('/sendMailCode', async ctx => {
        await sendMailCode(ctx);
    })
    .post('/sendMailNormal', async ctx => {
        await sendMailNormal(ctx);
    })
    //上传文件到阿里OSS
    .post('/oss/upFile', async ctx => {
        try {
            const flag = await checkFile(ctx);
            if (!flag) return;
            await upFileForOss(ctx);
        } catch (e) {
            ctx.body = {status: 500, msg: '未上传文件'};
        }
    })
    //上传文件到本地
    .post('/local/upFile', async ctx => {
        try {
            const flag = await checkFile(ctx);
            if (!flag) return;
            await upFileForLocal(ctx);
        } catch (e) {
            ctx.body = {status: 500, msg: '上传出错', e};
        }
    });
module.exports = router.routes();
