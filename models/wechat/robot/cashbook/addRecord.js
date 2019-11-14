// 添加记录
const moment = require('moment');
const addRecord = async info => {
    const sql = 'insert into cashbook(uuid,date,money,des) values(?,?,?,?)';
    const {id, date = moment(Date.now()).format('YYYY-MM-DD'), money, des} = info;
    const params = [id,date,money,des];
    const db = await dbquery(sql,params);
    console.log(db)
    if(db.code!==200){
        log4.Info('记账失败');
        return '记账失败'
    }
    return '小主，您的消费记录已经添加成功哦~'
};

module.exports = addRecord;
