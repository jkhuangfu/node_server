const koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const session = require('koa-session');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const path = require('path');
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
const {ctrlCommon} = require('./src/global/index');
const userRouter = require('./routes/user');
const common = require('./routes/common');
const viewRouter = require('./routes/viewRouter');
const blogRouter = require('./routes/blog');
const wxRouter = require('./routes/wechat');
const testRouter = require('./routes/test');
ctrlCommon(app);
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

const _cors = (ctx, next) => {
    //指定服务器端允许进行跨域资源访问的来源域。可以用通配符*表示允许任何域的JavaScript访问资源，但是在响应一个携带身份信息(Credential)的HTTP请求时，必需指定具体的域，不能用通配符
    ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:8081");

    //指定服务器允许进行跨域资源访问的请求方法列表，一般用在响应预检请求上
    ctx.set("Access-Control-Allow-Methods", "OPTIONS,POST,GET,HEAD,DELETE,PUT");

    //必需。指定服务器允许进行跨域资源访问的请求头列表，一般用在响应预检请求上
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

    //告诉客户端返回数据的MIME的类型，这只是一个标识信息,并不是真正的数据文件的一部分
    ctx.set("Content-Type", "application/json;charset=utf-8");

    //可选，单位为秒，指定浏览器在本次预检请求的有效期内，无需再发送预检请求进行协商，直接用本次协商结果即可。当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
    ctx.set("Access-Control-Max-Age", 300);

    //可选。它的值是一个布尔值，表示是否允许客户端跨域请求时携带身份信息(Cookie或者HTTP认证信息)。默认情况下，Cookie不包括在CORS请求之中。当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";如果没有设置这个值，浏览器会忽略此次响应。
    ctx.set("Access-Control-Allow-Credentials", true);

    //可选。跨域请求时，客户端xhr对象的getResponseHeader()方法只能拿到6个基本字段，Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。要获取其他字段时，使用Access-Control-Expose-Headers，xhr.getResponseHeader('myData')可以返回我们所需的值
    ctx.set("Access-Control-Expose-Headers", "myData");

    next()

};

// 路由
router.use('', viewRouter)
router.use('/users', userRouter);
router.use('/common', common);
router.use('/wx', wxRouter);
router.use('/t', testRouter);
router.use('/blog', blogRouter);
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
    .use(_cors)
    // 路由配置
    .use(router.routes())
    .on('error', err => {
        log4.Error(err);
    });
module.exports = app;
