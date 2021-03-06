const express = require('express');
const router = express.Router();
const register = require('../models/user/register');
const login = require('../models/user/login');
const { changePwd } = require('../models/user/changePwd');
const check_login = require('../middlewares/checklogin');
const { changeUserAvatar } = require('../models/user/changeUserAvatar');
const cashbook_login = require('../models/cashbook/login');
router
    .post('/reg', (req, res) => {
        console.log('====进入注册流程====');
        register.register(req, res)
    })
    .post('/checkLogin',async (req,res)=>{
        const isLogin = await redisDb.get('dr_net' + req.sessionID);
        if (isLogin && JSON.parse(isLogin).user) {
            res.json({code:200});
        }else{
            res.json({code:400})
        }
    })
    .post('/login', (req, res) => {
        console.log('====进入登陆流程====');
        login.login(req, res)
    })
    .post('/cashbook/login',(req,res)=>{
        log4.Info('进入cashbook登录流程');
        cashbook_login(req,res);
    })
    .post('/logout', async (req, res) => {
        console.log('======退出登录=====');
        const flag = await redisDb.del('dr_net'+req.sessionID);
        delete req.session;
        flag ? res.json({code:200}) : res.json({code:400});
    })
    .use(check_login)
    .post('/changePassword', (req, res) => {
        console.log('====进入修改密码流程====');
        changePwd(req, res);
    })
    .post('/changeUserAvatar', (req, res) => {
        console.log('====进入修改头像流程====');
        changeUserAvatar(req, res);
    });


module.exports = router;
