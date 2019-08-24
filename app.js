const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const common = require('./src/global'); //全局使用方法及变量
const MemoryStore = require('memorystore')(session); //session存放在内存中
const RedisStore = require('connect-redis')(session);//session 存放在redis中
const view = require('./routes/viewRouter'); //页面渲染
const user = require('./routes/user'); //后台管理接口
const blog = require('./routes/blog'); //博客相关
const wechat = require('./routes/wechat'); //微信相关
const commonRouter = require('./routes/common');

const cors = require('cors');
const app = express();
const redisOption = require('./src/config/redis')[app.get('env') === 'development' ? 'configDev' : 'configProd'];
common.ctrlCommon(app);
const corsOptions = {
    origin: 'http://127.0.0.1:8080', //此处设置允许访问的域名
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
    store:new RedisStore({
        ...redisOption,
        db: 0,
        prefix: 'drnet'
    }),
    secret: 'mRAewUjWeLopm0Hu8v', //与cookieParser中的一致
    resave: true, //每次会话重新设置过期时间
    saveUninitialized: true,
    HttpOnly: true,
    cookie: { maxAge: 30 * 60 * 1000, secure: false } //过期时间
}));
//全局session
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', view);
app.use('/users', user);
app.use('/blog', blog);
app.use('/wx', wechat);
app.use('/common', commonRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    //res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).send('service is err：\n\n'+err);
   // res.render('error');
    next();
});
module.exports = app;
