const express = require('express');
const router = express.Router();
const register = require('../src/dao/user/register');
const login = require('../src/dao/user/login');
const changePwd = require('../src/dao/user/changePwd')
router
    .post('/reg', (req, res) => {
        console.log('====进入注册流程====');
        register.register(req, res)
    })
    .post('/login', (req, res) => {
        console.log('====进入登陆流程====');
        login.login(req, res)
    })
    .post('/changePassword', (req, res) => {
        console.log('====进入修改密码流程====');
        changePwd.changePwd(req, res)
    })
    //注销
    .post('/logout', (req, res) => {
        console.log('======退出登录=====');
        req.session.user && delete req.session.user;
        res.json({code:200})
    });

module.exports = router;
