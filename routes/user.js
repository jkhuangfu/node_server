const express = require('express');
const router = express.Router();
const register = require('../src/dao/user/register');

router.get('/reg',(req,res)=>{
    log4.Info('====进入注册流程====');
    register.register(req,res)
});
module.exports = router;