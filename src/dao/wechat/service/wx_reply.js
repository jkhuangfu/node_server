const ejs = require('ejs');
const xml2js = require('xml2js');
const getRawBody = require('raw-body');
const wx_xml_template = require('./wx_template');
const {weather, phone} = require('../robot/lib/index');
// 解析XML为JSON对象
const parseXML = xml => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, {trim: true, explicitArray: false, ignoreAttrs: true}, function (err, result) {
            if (err) {
                return reject(err)
            }
            resolve(result.xml)
        })
    })
};

// 接收消息 返回 JSON对象
const getXML = async req => {
    const xml = await getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: 'utf-8'
    });
    return await parseXML(xml);
};
// 创建消息模板
const createReplyXml = (content, fromUsername, toUsername) => {
    const info = {};
    let type = 'text';
    info.content = content || '';
    // 判断消息类型
    if (Array.isArray(content)) {
        type = 'news';
    } else if (typeof content === 'object') {
        if (content.hasOwnProperty('type')) {
            type = content.type;
            info.content = content.content
        } else {
            type = 'music';
        }
    }
    info.msgType = type;
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return ejs.compile(wx_xml_template, null)(info);
};

// 创建回复内容 XML格式
const reply = async req => {
    // 根据接收消息类型进行回复
    const xml_json = await getXML(req);
    console.log('接收的消息', xml_json);
    const {MsgType, MediaId, Content, ToUserName, FromUserName, Event} = xml_json;
    let content = null;
    if (MsgType === 'text') {

        if(Content.indexOf('天气')>-1){
            content = await weather(Content)
        }else if(Content.indexOf('手机')>-1){
            content = await phone(Content)
        }else {
            content = '你说的我还不懂哦~';
        }
    } else if (MsgType === 'image') {
        content = {
            type: 'image',
            content: {
                mediaId: MediaId
            },
        }
    } else if (MsgType === 'voice') {
        content = {
            type: 'voice',
            content: {
                mediaId: MediaId
            },
        }
    } else if (MsgType === 'event') {
        // 关注或取关
        if (Event === 'subscribe') {
            content = '终于等到你，还好我没放弃!'
        } else if (Event === 'LOCATION') {

        }
    } else {
        console.log('不支持的微信接收信息', MsgType);
        content = '不支持该类型信息';
    }
    console.log('返回数据', createReplyXml(content, ToUserName, FromUserName));
    return createReplyXml(content, ToUserName, FromUserName);
};

module.exports = reply;
