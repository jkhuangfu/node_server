const request = require('request');
const config = require('./wxconfig');
const cache = require('memory-cache');
//access_token
module.exports = {
    getToken: () => {
        if (!cache.get('access_token')) {
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.config.APPID + '&secret=' + config.config.APPSECRET,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                }
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    cache.put('access_token', body.access_token);
                    return body.access_token;
                }
            });
        } else {
            return cache.get('access_token');
        }

    }
}