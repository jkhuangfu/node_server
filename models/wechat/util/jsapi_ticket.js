const cache = require('memory-cache');
module.exports = {
    getTicket: async token => {
        log4.Info('===获取ticket====');
        log4.Info('token信息===' + token);
        const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
        const response = await fetchData(url, 'GET');
        const {data, status} = response;
        if (status !== 200) {
            log4.error('ticket获取失败=====' + data.errmsg);
            return false;
        }
        log4.Info('ticket===' + data.ticket);
        await cache.put('jsapi_ticket', data.ticket, 7200000); //放入缓存7200000ms有效期
        return data.ticket;
    }
};
