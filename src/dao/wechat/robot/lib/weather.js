const fetch = require('axios');
const formatWeather = (local, weather_info) => {
    const weather = weather_info.data;
    const {forecast, ganmao} = weather;
    let str = '为您查询【' + local + '天气】如下:\n\n';
    for (let i in forecast) {
        for (let j in forecast[i]) {
            if (j === 'date') {
                str += '【' + forecast[i][j] + "】\n\r";
            } else if (j !== 'fengli') {
                str += forecast[i][j] + '  '
                if(j==='type'){
                    str += '\n'
                }
            }
        }
    }
    str += '\n\r';
    if (ganmao) {
        str += '\n[玫瑰]' + ganmao + '[玫瑰]';
    }
    return str;
};

const weather = async msgContent => {
    const local = msgContent.replace(/天气/g, '');
    const url = 'http://wthrcdn.etouch.cn/weather_mini?city=' + encodeURI(local);
    const data = await fetch.get(url);
    const {status} = data.data;
    // console.log('----------', data.data);
    if (status === 1000) {
        console.log(formatWeather(local, data.data).toString())
        return formatWeather(local, data.data);
    } else {
        return '未查找到相关天气信息。请尝试输入格式如"广州天气"。';
    }
};

module.exports = weather;
