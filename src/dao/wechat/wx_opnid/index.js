/*
 * 微信 openid获取接口
 * */

module.exports = {
    getOpenid: async ctx => {
        const {appid, secret, code} = reqBody(ctx);
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
        const response = await fetchData(url, 'GET');
        ctx.body = response;
    }
};
