const request = require('request');
const cache = require('memory-cache');
const token = require('./access_token');
module.exports = {
    getTicket: async() => {
        let Token = '';
        console.log('===进入获取wx jsapi_ticket===进程');
        if (cache.get('access_token')) {
            Token = cache.get('access_token');
        } else {
            Token = await token.getToken();
        };
        request({
            url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + Token + '&type=jsapi',
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log('===获取jsapi_ticket并放入cache===');
                cache.put('ticket', body.ticket);
                return body.ticket;
            }
        });
    }
}