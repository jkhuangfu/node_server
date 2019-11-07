const cache = require('memory-cache');
module.exports = {
    getToken: async (appid, secret) => {
        log4.Info('===获取token====');
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
        const response = await fetchData(url, 'GET');
        const {data, status} = response;
        if (status !== 200) {
            log4.Info('===获取token失败===' + response);
            return false;
        }
        const {access_token} = data;
        log4.Info('===获取access_token并放入cache===');
        log4.Info('token====' + access_token);
        await cache.put('access_token', access_token, 7200000); // 放入缓存7200000ms有效期两小时有效期
        return access_token;
    }
};
