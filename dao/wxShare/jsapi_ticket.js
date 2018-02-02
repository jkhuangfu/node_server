const request = require('request');
const cache = require('memory-cache');
const token = require('./access_token');
module.exports = {
    getTicket: async() => {
        let Token = await token.getToken();
        if (!cache.get('ticket')) {
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + Token + '&type=jsapi',
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                }
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    cache.put('ticket', body.ticket);
                    return body.ticket;
                }
            });
        } else {
            return cache.get('ticket');
        }
    }
}