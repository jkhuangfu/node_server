const cache = require('memory-cache');
const request = require('request');
module.exports = {
    getToken: (appid, secret) => {
        log4.Info('===获取token====');
        return new Promise((resolve, reject) => {
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                }
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    log4.Info('===获取access_token并放入cache===');
                    log4.Info('token====' + body.access_token);
                    cache.put('access_token', body.access_token, 7200000); //放入缓存7200000ms有效期两小时有效期
                    resolve(body.access_token);
                }
            })
        });
    }
}