/*
* 微信 openid获取接口
* */
const request = require('request');
module.exports = {
    getOpenid:(req,res)=>{
        let {appid,secret,code} = reqBody(req);
        request({
            url:`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        },(error,response,body)=>{
            if(!error && response.statusCode === 200){
                res.json({ status: 200,data:body, message: 'success' });
            }else{
                res.json({ status: 500, message: '获取 openid 失败' });
            }
        })
    }
};
