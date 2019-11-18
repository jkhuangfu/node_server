const koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const session = require('koa-session');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const path = require('path');
const fs = require('fs');
const app = new koa();
const router = new Router();
const koaBody = require('koa-body')({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传（缓存）目录
        keepExtensions: true, // 保持文件的后缀
        maxFileSize: 2 * 1024 * 1024
    }
});
require('./util/inedx');// 暴露全局变量
// 允许请求的白名单（允许跨域的域名）
const cors_domain = /^http:\/\/localhost|^http:\/\/127.0.0.1|drnet.xyz$/;
const corsOptions = {
    origin: ctx => {
        // 跨域处理
        const requestOrigin = ctx.headers.origin;
        if (cors_domain.test(requestOrigin)) {
            return requestOrigin;
        }
        return false;
    },
    credentials: true
};
//session cookie 加密信息
app.keys = ['W@7712duagdb6hddhgW!'];
const sessionConfig = {
    key: 'dr_net',
    maxAge: 30 * 60 * 1000, //session 有效期 30Min
    autoCommit: true,
    overwrite: true,
    rolling: true, //设置为 true 刷新页面重新计时
    signed: true
};

// 处理错误信息,发送错误码
const err = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.type = 'json';
        ctx.response.body = {
            code: ctx.response.status,
            message: err.message
        };
        ctx.app.emit('error', err, ctx);
    }
};


//配置路由
fs.readdirSync(path.join(__dirname, './routes')).forEach(route => {
    let api = require(`./routes/${route}`);
    router.use(route === 'view.js' ? '' : `/${route.replace('.js', '')}`, api);
});

app
    .use(err)
    // session 中间件
    .use(session(sessionConfig, app))
    // 渲染前端页面 模板引擎为 ejs | html
    .use(
        views(path.join(__dirname, 'views'), {
            extension: 'ejs' // html
        })
    )
    // 配置静态资源加载中间件
    .use(koaStatic(path.join(__dirname, 'public')))
    .use(koaBody)
    .use(cors(corsOptions))
    // 路由配置
    .use(router.routes())
    .on('error', err => {
        log4.Error(err);
    });
module.exports = app;
