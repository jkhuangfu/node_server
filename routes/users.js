const express = require('express');
const router = express.Router();
const login = require('../dao/login/login');
const register = require('../dao/register/register');
const changePwd = require('../dao/changePwd/changePwd');
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
router.post('/test', (req, res, next) => {
    data = {
        page: req.body.page,
        rows: 8,
        termCountStart: 1,
        termCountEnd: 60
    };
    // console.log(data)
    request({
        url: 'http://www.juyouqian.ren/product/productLoanList.shtml?rows=8&termCountStart=1&termCountEnd=60&page=' + req.body.page,
    }, function(error, response, body) {
        console.log(response)
        if (!error && response.statusCode == 200) {
            /* cache.put('access_token', body.access_token);
            return body.access_token; */
            res.json(body)
        }
    });
    /* axios.post('http://www.juyouqian.ren/product/productLoanList.shtml', {
        page: param.page,
        rows: 8,
        termCountStart: 1,
        termCountEnd: 60
    }).then((response) => {
        console.log(response);
        res.json(response.data)
    }) */
})
module.exports = router;