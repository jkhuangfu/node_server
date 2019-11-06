const ejs = require('ejs');
const template = require('./wx_template');
const createXML = info => {
    const {type} = info;
    const tpl = template[type];
    return ejs.compile(tpl,[]);
};

const reply = (content, fromUsername, toUsername) => {
    const info = {};
    info.msgType = type;
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return createXML(info);
};

module.exports = reply;
