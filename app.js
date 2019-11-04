const koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const session = require('koa-session');
const koaStatic = require('koa-static');
const path = require('path');
const app = new koa();
const router = new Router();
const koaBody = require('koa-body')({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传（缓存）目录
        keepExtensions: true,    // 保持文件的后缀
        maxFileSize: 2 * 1024 * 1024
    }
});


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


// 处理错误信息,发送错误码
const err = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
        ctx.app.emit('error', err, ctx);
    }
};

// 路由
router.use('', viewRouter).use('/t', user).use('/common', common);
app
// session 中间件
    .use(session(sessionConfig, app))
    // 渲染前端页面 模板引擎为 ejs | html
    .use(views(path.join(__dirname, 'views'), {
        extension: 'ejs'// html
    }))
    // 配置静态资源加载中间件
    .use(koaStatic(
        path.join(__dirname, 'public')
    ))
    .use(koaBody)
    // .use(err)
    // 路由配置
    .use(router.routes())
    .use(err);

app.on('error', async (err, ctx) => {
    console.log(err)
    ctx.throw(500, err);
});

module.exports = app;
