const sha1 = require('sha1');
const tiket = require('./jsapi_ticket');
const noncestr = 'Wm3WsdsTPz0wzccnW';
const config = require('./wxconfig');
module.exports = {
    signature: (req, res, next) => {
        //let param = req.query || req.params; //get请求
        let param = req.body; //post
        let timestamp = Math.floor(Date.now() / 1000);
        string1 = 'jsapi_ticket=' + tiket.getTicket() + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + param.url;
        signature = sha1(string1);
        res.json({
            appId: config.config.APPID, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
        });
    }
}