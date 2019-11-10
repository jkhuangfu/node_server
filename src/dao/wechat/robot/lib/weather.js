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
                if (j === 'type') {
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

const formatWeatherV2 = (local, detail) => {
    let str = '为您查询【' + local + '一周天气】如下:\n\n';
    detail.map(item => {
        str += `【${item.day + item.week}】\n${item.wea}最高温度：${item.tem1},最低温度：${item.tem2}\n\n`;
    });
    str += `【[玫瑰]今日温馨小贴士[玫瑰]】:${detail[0].air_tips}`;
    return str;
};
const weather = async msgContent => {
    const local = msgContent.replace(/天气/g, '');
    // const sql = `select id from city where cityZh = '${local}'`;
    // const db = await dbquery(sql);
    // if (db.code !== 200 || db.result.length === 0) {
    //     return '未查找到相关地区天气信息';
    // }
    // const id = db.result[0].id;
    const url = 'http://wthrcdn.etouch.cn/weather_mini?city=' + encodeURI(local);
    // api相关接口说明--->https://www.tianqiapi.com/?action=v1
    // const url = `https://www.tianqiapi.com/api/?version=v1&cityid=${id}&appid=61768783&appsecret=kZ5nRfeG`;
    const result = await fetch(url);
    const {status, data} = result;
    if (status === 200) {
        // return formatWeatherV2(local, data.data);
        return formatWeather(local, data);
    } else {
        return '未查找到相关天气信息。请尝试输入格式如"广州天气"。';
    }
};

module.exports = weather;
