const koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const path = require('path');
// const bodyParser = require("koa-bodyparser")();
const koaBody = require('koa-body')({
    // buffer:true,
    // querystring: require('qs')
    // patchNode: true,
    multipart: true,
    // formidable: {keepExtensions: true,}
});

const session = require('koa-session');
const koaStatic = require('koa-static');
const app = new koa();
const router = new Router();
const {ctrlCommon} = require('./src/global/index');
const user = require('./routes/u');
const common = require('./routes/common');
const viewRouter = require('./routes/common');
ctrlCommon(app);
//session cookie 加密信息
app.keys = ['W@7712duagdb6hddhgW!'];
const sessionConfig = {
    key: 'dr_net',
    maxAge: 30 * 60 * 1000,//session 有效期 30Min
    autoCommit: true,
    overwrite: true,
    rolling: true,//设置为 true 刷新页面重新计时
    signed: true
};


//处理错误信息,发送错误码
const err = async (ctx, next) => {
    try {
        ctx.body = {
            code: ctx.response.status,
            message: ctx.response.message
        };
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
    }
};

//路由
router.use('', viewRouter).use('/t',user).use('/common', common);
app
//session 中间件
    .use(session(sessionConfig, app))
    //渲染前端页面 模板引擎为 ejs | html
    .use(views(path.join(__dirname, 'views'), {
        extension: 'ejs'// html
    }))
    // 配置静态资源加载中间件
    .use(koaStatic(
        path.join(__dirname, 'public')
    ))
    .use(koaBody)
    // .use(bodyParser)
    // 路由配置
    .use(router.routes())
    .use(err);

module.exports = app;
