// 查账
/**
 * type 金额（区间） 日期（区间） 全部
 *
 * */
const moment = require('moment');
const formatRecord = data => {
    let str = '';
    if (data.length === 0) {
        return '未查询到相关记录呢~';
    }
    str += '【亲爱的小主为您查询到以下结果】:\n';
    data.map(item => {
        str += '您于'+moment(item.date).format('YYYY-MM-DD') + '因' + item.des + '消费' + item.money + '元\n\n';
    });
    return str;
};
const queryRecord = async info => {
    const {id, max_money, min_money, start_date, end_date} = info;
    const sql = `select date,money,des
                 from (select * from cashbook where uuid = '${id}') as t
                 where money >= ${min_money} and money <= ${max_money} 
                 and date <= '${end_date}' and date >= '${start_date}'`;
    const db = await dbquery(sql);
    if (db.code !== 200) {
        return '查询失败，换个姿势再试试？';
    }
    return formatRecord(db.result);
};

module.exports = queryRecord;
