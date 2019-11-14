const moment = require('moment');
const queryRecord = async (req, res) => {
    const {id} = req.session.wx;
    const { max_money = 2000000, min_money = 0, start_date, end_date} = reqBody(req);
    const sql = `select date,money,des
                 from (select * from cashbook where uuid = '${id}') as t
                 where money >= ${min_money} and money <= ${max_money} 
                 and date <= '${end_date}' and date >= '${start_date}'`;
    const db = await dbquery(sql);
    if (db.code !== 200) {
        res.json(db);
    }
    let data = db.result;
    data.length && data.forEach(item => {
        item.date = moment(item.date).format('YYYY-MM-DD');
    });
    res.json({code: 200, data: db.result});
};
module.exports = queryRecord;
