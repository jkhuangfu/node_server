const icon = require('iconv-lite');
const chat = async (id, info) => {
    const typeReg = /(?<="type":").*?(?=",)/g;
    const contentReg = /(?<="content":").*?(?=",)/g;
    const url = 'http://i.xiaoi.com/robot/webrobot?&callback=__webrobot_processMsg&data='
        + '{"sessionId":"' + id + '",'
        + '"robotId":"webbot",'
        + '"userId":"' + id + '"'
        + ',"body":{"content":"' + encodeURIComponent(info) + '"},"type":"txt"}'
        + '&ts=' + Date.now();
    const data = await fetchData(url);
    const result = icon.decode(data.data, 'utf-8').split(';').slice(4);
    const charge = result[0];
    const type = charge.match(typeReg)[0];
    const content = charge.match(contentReg)[0];
    if (type === 'txt') {
        return content
    }
    return false;
};

module.exports = chat;
