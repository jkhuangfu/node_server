const router = require('koa-router')();
const checklogin = require('../middlewares/checklogin');
const {publishArticle, queryArticle, queryArticleById, deleteArticle, changeArticleStatus} = require('../src/dao/blog/article');
const {publishMessage, deleteMessage, queryMessage, changeMessageStatus} = require('../src/dao/blog/message');
router
    .use(checklogin)
    .post('/changeArticleStatus', async ctx => {
        await changeArticleStatus(ctx);
    })
    .post('/deleteArticle', async ctx => {
        await deleteArticle(ctx);
    })
    .post('/queryArticle', async ctx => {
        await queryArticle(ctx);
    })
    .post('/publishArticle', async ctx => {
        await publishArticle(ctx);
    })
    .post('/queryArticleById', async ctx => {
        await queryArticleById(ctx);
    })
    .post('/publishMessage', async ctx => {
        await publishMessage(ctx);
    })
    .post('/deleteMessage', async ctx => {
        await deleteMessage(ctx);
    })
    .post('/changeMessageStatus', async ctx => {
        await changeMessageStatus(ctx)
    })
    .post('/queryMessage', async ctx => {
        await queryMessage(ctx);
    });

module.exports = router.routes();
