const cache = require('memory-cache');
const request = require('request');
module.exports = {
    getTicket: (token) => {
        log4.Info('===获取ticket====');
        log4.Info('token信息===' + token);
        return new Promise((resolve, reject) => {
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
                    log4.Info(body);
                    log4.Info('ticket===' + body.ticket);
                    cache.put('jsapi_ticket', body.ticket, 7200000); //放入缓存7200000ms有效期
                    resolve(body.ticket);
                }
            });
        });
    }
}