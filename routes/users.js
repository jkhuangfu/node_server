const express = require('express');
const router = express.Router();
const login = require('../dao/login/login');
const register = require('../dao/register/register');
const changePwd = require('../dao/changePwd/changePwd');
const captchapng = require('captchapng2'); //验证码组建
const pnglib = require('pnglib');
const p = new pnglib(100, 80, 8);
const signature = require('../dao/wxShare/signature');
/* GET users listing. */
// 注册
router.get('/register', (req, res, next) => {
    register.register(req, res, next);
});
//验证码
router.get('/cacp', (req, res, next) => {
    let rand = parseInt(Math.random() * 9000 + 1000);
    let png = new captchapng(100, 30, rand);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    req.session.img = rand;
    res.end(png.getBuffer());
});
//登录
router.get('/login', (req, res, next) => {
    login.login(req, res, next);
});
//修改密码
router.get('/changePwd', (req, res, next) => {
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
module.exports = router;