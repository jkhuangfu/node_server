const express = require('express');
const router = express.Router();
const signature = require('../src/dao/wechat/wx_signature/signature');
const getOpenid = require('../src/dao/wechat/wx_opnid/index');

router
    //微信分享获取签名
    .post('/wx_signature', (req, res, next) => {
        console.log('======发送微信签名=====');
        signature.signature(req, res, next);
    })
    //获取微信 openid
    .post('/wx_openid', (req, res, next) => {
        console.log('======发送微信openid=====');
        getOpenid.getOpenid(req, res, next);
    });

module.exports = router;
