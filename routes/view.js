const router = require('koa-router')();
const fs = require('fs');

/* 微信txt文件验证专用 txt文件放置在public文件根目录 */
const render = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(`/${file}`, "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};
router
    // 微信txt文件验证
    .get('/*.txt', async ctx => {
        const html = await render(ctx.request.url);
        await ctx.render(html);
    })
    /* GET home page. */
    .get('/', async ctx => {
        await ctx.render('index');
    })
    .get('/wx', async ctx => {
        await ctx.render('wx');
    })
    /* to 404 page */
    .get('/notFound', async ctx => {
        await ctx.render('error');
    });
module.exports = router.routes();
