const express = require('express');
const router = express.Router();
const login = require('../dao/login/login');
const register = require('../dao/register/register');
const changePwd = require('../dao/changePwd/changePwd');
const doMsg = require('../dao/manger/messageDo/queryMessage');
const postMsg = require('../dao/manger/messageDo/postMessage');
const captchapng = require('captchapng2'); //验证码组建
const pnglib = require('pnglib');
const p = new pnglib(100, 80, 8);
const signature = require('../dao/wxShare/signature');
const log4 = require('../log4/log4').log;
const axios = require('axios');
const common = require('../dao/common/common');
const request = require('request');
common.ctrlCommon();
/* GET users listing. */
// 注册
router.post('/register', (req, res, next) => {
    log4.Info('======开始注册=====');
    register.register(req, res, next);
});
//验证码
router.get('/cacp', (req, res, next) => {
    let rand = parseInt(Math.random() * 9000 + 1000);
    log4.Info('======获取验证码=====' + rand);
    let png = new captchapng(100, 30, rand);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    req.session.img = rand;
    res.end(png.getBuffer());
});
//登录
router.post('/login', (req, res, next) => {
    log4.Info('======开始登录=====')
    login.login(req, res, next);
});
//修改密码
router.get('/changePwd', (req, res, next) => {
    log4.Info(req.session.user.userName + '======进行修改密码=====')
    changePwd.changePwd(req, res, next);
});
//注销
router.get('/logout', (req, res, next) => {
    req.session.user = {};
    res.redirect('../')
});
//微信分享
router.post('/wx', (req, res, next) => {
    signature.signature(req, res, next);
});
/* 留言接口 */
router.post('/delMsg', (req, res, next) => {
    doMsg.deleteMessage(req, res, next)
});
router.post('/getMsg', (req, res, next) => {
    doMsg.getMsg(req, res, next)
});
router.post('/liveMsg', (req, res, next) => {
    postMsg.postMsg(req, res, next);
})
module.exports = router;