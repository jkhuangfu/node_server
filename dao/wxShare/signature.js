const sha1 = require('sha1');
const request = require('request');
const cache = require('memory-cache');
const noncestr = 'Wm3WsdsTPz0wzccnW';
const config = require('./wxconfig');
const wxTicket = require('./jsapi_ticket');
const wxToken = require('./access_token');
const writeJson = (res, timestamp, signature) => {
    let resData = {
        appId: config.config.APPID, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
    };
    res.send(resData);
};
//前台传递的url必须encodeURIComponent操作
module.exports = {
    signature: async(req, res, next) => {
        log4.Info('===进入签名===');
        let param = req.body;
        let string1 = '';
        let timestamp = Math.floor(Date.now() / 1000); //时间戳
        if (cache.get('access_token') && cache.get('jsapi_ticket')) { //缓存中有token和jsapi_ticket
            log4.Info('缓存中有token和jsapi_ticket');
            string1 = 'jsapi_ticket=' + cache.get('jsapi_ticket') + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
            log4.Info(string1);
            let signature = sha1(string1);
            writeJson(res, timestamp, signature);
        } else {
            log4.Info('缓存中没有token和jsapi_ticket');
            const token = await wxToken.getToken(config.config.APPID, config.config.APPSECRET);
            const jsapi_ticket = await wxTicket.getTicket(token);
            string1 = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
            let signature = sha1(string1);
            writeJson(res, timestamp, signature);
        };
    }
};