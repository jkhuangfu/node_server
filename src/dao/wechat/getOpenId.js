/*
* 微信 openid获取接口
* */

const getOpenid = async (req, res) => {
    const {appid, secret, code} = reqBody(req);
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    const response = await fetchData(url, 'GET');
    res.json(response);
};
module.exports = getOpenid;
