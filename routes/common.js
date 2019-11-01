const Router = require('koa-router');
const router = new Router();
const checklogin = require('../middlewares/checklogin');
const captcha = require('../src/dao/common/cacp');
const {upFileForOss, upFileForLocal} = require('../src/dao/common/upFile');
const {sendMailCode, sendMailNormal} = require('../src/dao/common/sendMail');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 600 * 1024 // 限制文件为600kb
    },
    dest: './public/upload'
});
// 上传文件中间件
const uploadMidleware = ctx => new Promise(resolve => {
    upload.array('file', 9)(ctx.req, ctx.res, err => {
        if (err instanceof multer.MulterError) {
            resolve({code: 102, msg: err.message});
        } else if (err) {
            resolve({code: 101, mag: err});
        } else {
            resolve({code: 200, files: ctx.req.files, type: ctx.req.body.type || null})
        }
    });
});

router
// .use(checklogin)
    .get('/cacp', async ctx => {
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
        const data = await uploadMidleware(ctx);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        await upFileForOss(ctx, data.files || []);
    })
    //上传文件到本地
    .post('/local/upFile', async ctx => {
        const data = await uploadMidleware(ctx);
        if (data.code !== 200) {
            ctx.body = data;
            return false;
        }
        await upFileForLocal(ctx, {files: data.files || [], type: data.type});
    });
module.exports = router.routes();
