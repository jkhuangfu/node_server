const express = require('express');
const router = express.Router();
const register = require('../src/dao/user/register');
const login = require('../src/dao/user/login');
const changePwd = require('../src/dao/user/changePwd')

router.get('/reg',(req,res)=>{
    console.log('====进入注册流程====');
    register.register(req,res)
});
router.get('/login',(req,res)=>{
    console.log('====进入登陆流程====');
    login.login(req,res)
});
router.get('/changepassword',(req,res)=>{
    console.log('====进入修改密码流程====');
    changePwd.changePwd(req,res)
});
//登陆验证
router.post('/checkLogin', (req, res, next) => {
    console.log('======查看登录态=====');
    if (req.session.user) {
        res.send('1')
    } else {
        res.send('0')
    };
});
//注销
router.post('/logout', (req, res) => {
    log4.Info(req.session.user.userName + '======退出登录=====');
    delete req.session.user;
    res.send('1')
});

module.exports = router;