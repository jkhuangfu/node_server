const express = require('express');
const router = express.Router();
const register = require('../src/dao/user/register');
const login = require('../src/dao/user/login');
const { changePwd } = require('../src/dao/user/changePwd');
const check_login = require('../middlewares/checklogin');
const { changeUserAvatar } = require('../src/dao/user/changeUserAvatar');
router
    .post('/reg', (req, res) => {
        console.log('====进入注册流程====');
        register.register(req, res)
    })
    .post('/login', (req, res) => {
        console.log('====进入登陆流程====');
        login.login(req, res)
    })
    .post('/logout', async (req, res) => {
        console.log('======退出登录=====');
        const flag = await redisDb.del('drnet'+req.sessionID);
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
