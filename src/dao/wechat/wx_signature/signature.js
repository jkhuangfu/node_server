const sha1 = require('sha1');
const cache = require('memory-cache');
const nonce_str = 'W6@jsgfh!qeJ';
const { APP_ID, APP_SECRET } = require('../../../config/wxconfig');
const wxTicket = require('./jsapi_ticket');
const wxToken = require('./access_token');
const writeJson = (res, timestamp, signature) => {
    let resData = {
        appId: APP_ID, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonce_str, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
    };
    res.send(resData);
};
//前台传递的url必须encodeURIComponent操作
module.exports = {
    signature: async(req, res) => {
        log4.Info('===进入签名===');
        try {
            let param = reqBody(req);
            let string1 = '';
            let timestamp = Math.floor(Date.now() / 1000); //时间戳
            if (cache.get('access_token') && cache.get('jsapi_ticket')) { //缓存中有token和jsapi_ticket
                log4.Info('缓存中有token和jsapi_ticket');
                string1 = 'jsapi_ticket=' + cache.get('jsapi_ticket') + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
                log4.Info(string1);
                let signature = sha1(string1);
                writeJson(res, timestamp, signature);
            } else {
                log4.Info('缓存中没有token和jsapi_ticket');
                const token = await wxToken.getToken(APP_ID, APP_SECRET);
                const jsapi_ticket = await wxTicket.getTicket(token);
                string1 = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
                let signature = sha1(string1);
                writeJson(res, timestamp, signature);
            }
        } catch (error) {
            log4.error(error);
            res.json({ status: 500, message: '签名失败' });
        }
    }
};
