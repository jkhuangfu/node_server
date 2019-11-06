const express = require('express');
const router = express.Router();
const getRawBody = require('raw-body');
const xml2js = require('xml2js');
const ejs = require('ejs');
const {signature} = require('../src/dao/wechat/wx_signature/signature');
const {getOpenid} = require('../src/dao/wechat/wx_opnid/index');
// const _reply = require('../src/dao/wechat/service/wx_reply');
const tpl = `
<xml> 
 <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName> 
 <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName> 
 <CreateTime><%=createTime%></CreateTime> 
 <MsgType><![CDATA[<%=msgType%>]]></MsgType> 
 <Content><![CDATA[<%-content%>]]></Content> 
</xml>
`;
const compiled = ejs.compile(tpl);

const getSignature = (timestamp, nonce, token) => {
    const arr = [token, timestamp, nonce].sort();
    return hash(arr.join(''), 'sha1');
};
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

const reply = (content, fromUsername, toUsername) => {
    const info = {};
    let type = 'text';
    info.content = content || '';
    // 判断消息类型
    if (Array.isArray(content)) {
        type = 'news'
    } else if (typeof content === 'object') {
        if (content.hasOwnProperty('type')) {
            type = content.type;
            info.content = content.content
        } else {
            type = 'music'
        }
    }
    info.msgType = type;
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return compiled(info)
};

router
//微信分享获取签名
    .post('/wx_signature', (req, res, next) => {
        console.log('======发送微信签名=====');
        signature(req, res, next);
    })
    //获取微信 openid
    .post('/wx_openid', (req, res, next) => {
        console.log('======发送微信openid=====');
        getOpenid(req, res, next);
    })
    .use('/wx_server', async (req, res) => {
        const {method} = req;
        const token = 'wx_token';
        const {signature, echostr, timestamp, nonce} = reqBody(req);
        const crypto = getSignature(timestamp, nonce, token);
        if (method === 'GET') {
            // 此处进行微信token验证
            if (signature === crypto) {
                res.end(echostr);
                console.log('微信验证token成功');
            } else {
                res.end('fail');
                console.log('微信验证token失败');
            }
        } else {
            if (signature !== crypto) {
                console.log(signature,crypto)
            }
            // 此处进行接收及处理消息
            const xml = await getRawBody(req, {
                length: req.headers['content-length'],
                limit: '1mb',
                encoding: 'utf-8'
            });
            const formatted = await parseXML(xml);
            console.log(JSON.stringify(xml));
            let content = '';
            if (formatted.Content === '音乐') {
                content = {
                    type: 'music',
                    content: {
                        title: 'Lemon Tree',
                        description: 'Lemon Tree',
                        musicUrl: 'http://mp3.com/xx.mp3'
                    },
                }
            } else if (formatted.MsgType === 'text') {
                content = formatted.Content
            } else if (formatted.MsgType === 'image') {
                content = {
                    type: 'image',
                    content: {
                        mediaId: formatted.MediaId
                    },
                }
            } else if (formatted.MsgType === 'voice') {
                content = {
                    type: 'voice',
                    content: {
                        mediaId: formatted.MediaId
                    },
                }
            } else {
                content = formatted.Content
            }
            const replyMessageXml = reply(content, formatted.ToUserName, formatted.FromUserName);
            console.log(JSON.stringify(replyMessageXml));
            res.send(replyMessageXml);
        }
    });

module.exports = router;
