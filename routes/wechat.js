const express = require('express');
const router = express.Router();
const fs = require('fs');
const signature = require('../src/dao/wechat/wx_signature/signature');
const getOpenid = require('../src/dao/wechat/wx_opnid/index');

/* 微信txt文件验证专用 txt文件放置在public文件根目录 */
const render = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('/MP_verify_tGmHaGktkQYkf6kr.txt', "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};
const route = async () => {
    let html = await render();
    return html
};
router.get('/MP_verify_tGmHaGktkQYkf6kr.txt', async(req, res, next) => {
    let html = await route();
    res.render(html);
});

//微信分享获取签名
router.post('/wx_signature', (req, res, next) => {
    console.log('======发送微信签名=====');
    signature.signature(req, res, next);
});
//获取微信 openid
router.post('/wx_openid', (req, res, next) => {
    console.log('======发送微信openid=====');
    getOpenid.getOpenid(req, res, next);
});

module.exports = router;