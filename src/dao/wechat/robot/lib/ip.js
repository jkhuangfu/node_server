const inc = require('iconv-lite');
const ip = async ip => {
    const _ip = ip.replace('ip','');
    const url = `http://whois.pconline.com.cn/ip.jsp?ip=${_ip}`;
    const ip_info = await fetchData(url);
    return JSON.stringify(inc.decode(ip_info.data, 'GBK')).replace(/[rn\\]/g,'');
};
module.exports = ip;
