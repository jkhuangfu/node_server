const {addRecord, queryRecord} = require('../cashbook');
const cashRobot = async (info, id) => {
    const info_detail = info.split(',');
    if (info_detail[0] === '记账') {
        const [money, date, des] = info_detail.slice(1);
        return await addRecord({id, date, money, des});
    } else {
        const [min_money, max_money, start_date, end_date] = info_detail.slice(1);
        return await queryRecord({id, max_money, min_money, start_date, end_date});
    }
};

module.exports = cashRobot;
