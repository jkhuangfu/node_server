const sha1 = require('sha1');
const request = require('request');
const cache = require('memory-cache');
const noncestr = 'Wm3WsdsTPz0wzccnW';
const log4 = require('../../log4/log4').log;
const config = require('./wxconfig');
//前台传递的url必须encodeURIComponent操作
module.exports = {
    signature: (req, res, next) => {
        log4.Info('===进入签名===');
        let param = req.body;
        let string1 = '';
        let timestamp = Math.floor(Date.now() / 1000);; //时间戳
        if (cache.get('access_token') && cache.get('jsapi_ticket')) { //缓存中有token和jsapi_ticket
            log4.Info('缓存中有token和jsapi_ticket');
            string1 = 'jsapi_ticket=' + cache.get('jsapi_ticket') + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
        } else {
            log4.Info('缓存中没有token和jsapi_ticket');
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.config.APPID + '&secret=' + config.config.APPSECRET,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                }
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    log4.Info('===获取access_token并放入cache===');
                    cache.put('access_token', body.access_token, 7200000); //放入缓存7200000ms有效期两小时有效期
                    let token = body.access_token;
                    request({
                        url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi',
                        method: "GET",
                        json: true,
                        headers: {
                            "content-type": "application/json",
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            log4.Info('===获取jsapi_ticket并放入cache===');
                            cache.put('jsapi_ticket', body.ticket, 7200000); //放入缓存7200000ms有效期
                            string1 = 'jsapi_ticket=' + body.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
                        }
                    });
                };
            });
        };
        log4.Info(string1);
        let signature = sha1(string1);
        let resData = {
            appId: config.config.APPID, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
        };
        res.send(resData);
    }
};