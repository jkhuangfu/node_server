const {APP_ID, APP_SECRET} = require('../../../config/wxconfig');
const {getToken} = require('../util/access_token');
const getUerInfo = async req => {
    const {openid} = reqBody(req);
    const access_token = await getToken(APP_ID, APP_SECRET);
    const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    return await fetchData(url);
};
module.exports = getUerInfo;
