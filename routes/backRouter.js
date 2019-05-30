const express = require('express');
const router = express.Router();
const login = require('../dao/back/login/login');
const register = require('../dao/back/register/register');
const changePwd = require('../dao/back/changePwd/changePwd');
const doMsg = require('../dao/back/manger/messageDo/queryMessage');
const postMsg = require('../dao/front/message/message');
const postArticle = require('../dao/back/manger/articleDo/postArticle');
const doArticle = require('../dao/back/manger/articleDo/doArticle');
const svgCaptcha = require('svg-captcha'); //验证码组件
const multer = require('multer'); //文件上传
const upload = multer({ dest: './tmmp/' });
// 注册
router.post('/register', (req, res, next) => {
    log4.Info('======开始注册=====');
    register.register(req, res, next);
});
//验证码
router.get('/cacp', (req, res) => {
    let captcha = svgCaptcha.createMathExpr({
        noise:3,
        color:true
    });
    log4.Info('======获取验证码=====' + captcha.text);
    res.type('svg');
    res.status(200).send(captcha.data);
});
//登录
router.post('/login', (req, res, next) => {
    log4.Info('======开始登录=====');
    login.login(req, res, next);
});
//修改密码
router.post('/changePwd', (req, res, next) => {
    log4.Info(req.session.user.userName + '======进行修改密码=====');
    changePwd.changePwd(req, res, next);
});
//注销
router.post('/logout', (req, res) => {
    log4.Info(req.session.user.userName + '======退出登录=====');
    delete req.session.user;
    res.send('1')
});

/* 留言管理接口 */
router.post('/delMsg', (req, res, next) => {
    log4.Info('======删除留言=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    doMsg.deleteMessage(req, res, next)
});
router.post('/getMsgByTitle', (req, res, next) => {
    log4.Info('======根据文章标题查询留言=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    doMsg.getMsgByTitle(req, res, next);
});
router.post('/getMsg', (req, res, next) => {
    log4.Info('======查询所有留言=====');
    if (!req.session.user) {
        res.send('0');
        return;
    };
    doMsg.getMsg(req, res, next)
});
/* 留言接口 */
router.post('/liveMsg', (req, res, next) => {
    log4.Info('======开始留言=====');
    postMsg.postMsg(req, res, next);
});
/* 文章接口 */
router.post('/postArticle', (req, res, next) => {
    log4.Info('======开始发布文章=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    postArticle.postArticle(req, res, next);
});
router.post('/upImage', upload.single('file'), (req, res, next) => {
    log4.Info('======开始上传图片=====');
    try {
        postArticle.upImage(req, res, next);
    } catch (err) {
        log4.writeErr(err)
    }

});
router.post('/getArticle', (req, res, next) => {
    log4.Info('======查询发布文章=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    doArticle.queryArticleByType(req, res, next);
});
router.post('/queryArticleByTitleAndStatus', (req, res, next) => {
    log4.Info('======查看不同显示状态的文章=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    doArticle.queryArticleByTitleAndStatus(req, res, next);
});
router.post('/changeArticleStatus', (req, res, next) => {
    log4.Info('======修改文章显示状态=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    doArticle.changeArticleStatus(req, res, next);
});
router.post('/deleteArticle', (req, res, next) => {
    log4.Info('======删除文章=====');
    if (!req.session.user) {
        res.send('0');
        return;
    }
    doArticle.deleteArticle(req, res, next);
});
/* 登录态验证 */
router.post('/checkLogin', (req, res, next) => {
    log4.Info('======查看登录态=====');
    if (req.session.user) {
        res.send('1')
    } else {
        res.send('0')
    };
});
module.exports = router;