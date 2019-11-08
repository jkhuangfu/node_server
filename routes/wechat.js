const express = require('express');
const router = express.Router();
const signature = require('../src/dao/wechat/signature');
const getOpenid = require('../src/dao/wechat/getOpenId');
const reply = require('../src/dao/wechat/service/wx_reply');
const w = require('../src/dao/wechat/robot/lib/ip');
// 微信服务接口加密校验
const getSignature = (timestamp, nonce, token) => {
    const arr = [token, timestamp, nonce].sort();
    return hash(arr.join(''), 'sha1');
};

router
//微信分享获取签名
    .post('/wx_signature', (req, res) => {
        console.log('======发送微信签名=====');
        signature(req, res);
    })
    .get('/w',async (req)=>{

        w('114.114.114.114')
    })
    //获取微信 openid
    .post('/wx_openid', (req, res, next) => {
        console.log('======发送微信openid=====');
        getOpenid(req, res, next);
    })
    .use('/wx_server', async (req, res) => {
        const {method} = req;
        const token = 'wx_token';
        const {signature, echostr, timestamp, nonce} = reqBody(req);
        const crypto = getSignature(timestamp, nonce, token);
        if (method === 'GET') {
            // 此处进行微信token验证
            if (signature === crypto) {
                res.end(echostr);
                console.log('微信验证token成功');
            } else {
                res.end('fail');
                console.log('微信验证token失败');
            }
        } else {
            const replyMessageXml = await reply(req);
            res.send(replyMessageXml);
        }
    });

module.exports = router;
