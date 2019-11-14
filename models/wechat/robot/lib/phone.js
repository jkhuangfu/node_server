const iconv = require('iconv-lite');
const parseStr = (key, str) => {
    const list = str.split(',');
    for (let i in list) {
        const kvs = list[i].split(":");
        if (kvs[0] === key) {
            return kvs[1];
        }
    }
    return null;
};
const phone = async msgContent => {
    const phone = msgContent.replace(/[手机|号]/g, '').trim();
    const url = 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + phone;
    const {data} = await fetchData(url);
    // 字符串匹配去除{}空格 换行符
    const result = JSON.stringify(iconv.decode(data, 'gbk').split('=').pop()).replace(/[\\n\s'{}]/g, '');
    console.log('手机号查询结果：',result);
    const province = parseStr('provice', result);// 归属地
    const catName = parseStr('catName', result);// 运营商
    // {
    //     mts:'1371799',
    //     province:'北京',
    //     catName:'中国移动',
    //     telString:'13717990258',
    //     areaVid:'29400',
    //     ispVid:'3236139',
    //     carrier:'北京移动'
    // }
    let str = '您查询的【' + phone + ' 】手机信息如下：\n\r\n\r';
    if (catName) {
        str += catName ? ('运营商：' + catName + '\n\r') : '';
        // str += areaVid? ('areaVid' + areaVid + '\n\r') : '';
        str += province ? ('归属地：' + province + '\n\r') : '';
    } else {
        str = '未查找到相关手机信息。请确认该手机号存在。'
    }
    console.log(JSON.stringify(str));
    return str;
};

module.exports = phone;
