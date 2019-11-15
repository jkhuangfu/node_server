const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session); //session存放在内存中
const RedisStore = require('connect-redis')(session);//session 存放在redis中
require('./util/inedx'); //全局使用方法及变量
const cors = require('cors');
const app = express();
const {NODE_ENV} = process.env;
const redisOption = require('./config/redis')[NODE_ENV === 'development' ? 'configDev' : 'configProd'];
// 跨域白名单
const whitelist = [/^http:\/\/localhost|^http:\/\/127.0.0.1|drnet.xyz$/];
const corsOptions = {
    origin: whitelist,
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));
//Session
app.use(cookieParser('mRAewUjWeLopm0Hu8v'));
app.use(session({
    // store: new MemoryStore({
    //     checkPeriod: 1000 * 60 * 60 * 24 // prune expired entries every 24 h
    // }),
    store: new RedisStore({
        ...redisOption,
        prefix: 'dr_net'
    }),
    secret: 'mRAewUjWeLopm0Hu8v', //与cookieParser中的一致
    resave: true, //每次会话重新设置过期时间
    rolling: true, //保证每次请求都会重置客户端cookie有效期
    saveUninitialized: true,
    HttpOnly: true,
    cookie: {maxAge: 30 * 60 * 1000, secure: false} //过期时间
}));
//全局session
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//配置路由
fs.readdirSync(path.join(__dirname, './routes')).forEach(route => {
    let api = require(`./routes/${route}`);
    app.use(`/${route === 'viewRouter.js' ? '' : route.replace('.js', '')}`, api);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
