let express = require('express');
let router = express.Router();
let login = require('../dao/login/login');
let register = require('../dao/register/register');
let img = require('../dao/cacp/cacp');
let changePwd = require('../dao/changePwd/changePwd');
let captchapng = require('captchapng'); //验证码组建
/* GET users listing. */
router.get('/register', (req, res, next) => {
    register.register(req, res, next);
});
router.get('/cacp', (req, res, next) => {
    let cacp = parseInt(Math.random() * 90000 + 10000);
    req.session.img = cacp;
    let p = new captchapng(100, 40, cacp);
    p.color(248, 248, 255, 255); // First color: background (red, green, blue, alpha)
    p.color(255, 0, 255, 255); // Second color: paint (red, green, blue, alpha)
    let _img = p.getBase64();
    let imgbase64 = new Buffer(_img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
});
router.get('/login', (req, res, next) => {
    login.login(req, res, next);
});
router.get('/changePwd', (req, res, next) => {
    changePwd.changePwd(req, res, next);
});
//注销
router.get('/logout', (req, res, next) => {
    req.session.user = {};
    res.redirect('../')
})
module.exports = router;