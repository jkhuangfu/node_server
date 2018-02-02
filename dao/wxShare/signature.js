const sha1 = require('sha1');
const tiket = require('./jsapi_ticket');
const noncestr = 'Wm3WsdsTPz0wzccnW';
const config = require('./wxconfig');
//前台传递的url必须encodeURIComponent操作
module.exports = {
    signature: async(req, res, next) => {
        //let param = req.query || req.params; //get请求
        let param = req.body; //post
        let timestamp = Math.floor(Date.now() / 1000);
        let _ticket = await tiket.getTicket();
        let success = '';
        let string1 = 'jsapi_ticket=' + _ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + decodeURIComponent(param.url);
        let signature = sha1(string1);
        console.log(string1);
        if (_ticket == undefined) {
            success = 'error';
        } else {
            success = 'success';
        };
        let resData = {
            success: success,
            appId: config.config.APPID, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
        };
        res.send(resData);
    }
}