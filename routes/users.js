let express = require('express');
let router = express.Router();
let login = require('../dao/login/login');
let register = require('../dao/register/register');
let changePwd = require('../dao/changePwd/changePwd');
let captchapng = require('captchapng2'); //验证码组建
let pnglib = require('pnglib');
let p = new pnglib(100, 80, 8);
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
})
module.exports = router;