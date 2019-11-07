const fetch = require('axios');
const iconv = require('iconv-lite');
const phone = async msgContent => {
    const phone = msgContent.replace(/手机/g, '').trim();
    const url = 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + phone;
    const result = await fetch(url);
    const data = result.data;
    console.log(iconv.decode(data,'gbk'))
    const res = JSON.stringify(iconv.decode(data.split('=').pop(),'GBK'));
    // console.log('--------->',res)
    const s = res.replace(/[\r\n]/g,'');
    // console.log('shouji----',s)
    const { province,catName,telString,carrier } = JSON.parse(res.replace(/[\r\n]/g,''));
    // {
    //     mts:'1371799',
    //         province:'北京',
    //     catName:'中国移动',
    //     telString:'13717990258',
    //     areaVid:'29400',
    //     ispVid:'3236139',
    //     carrier:'北京移动'
    // }
    let str = '【' + phone + ' 手机信息】\n\r\n\r';
    if (carrier) {
        str += carrier? ('运营商：' + carrier + '\n\r') : '';
        // str += areaVid? ('areaVid' + areaVid + '\n\r') : '';
        str += province? ('归属地' + province + '\n\r') : '';
    } else {
        str = '未查找到相关手机信息。请确认该手机号存在。'
    }
    return str;
};

module.exports = phone;
