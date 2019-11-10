const {weather, phone, ip, chatRobot} = require('../robot/lib/index');
const Menu = {
    '/手机/g': phone,
    '/ip/g': ip,
    '/-天气/g': weather
};
const help_con = '现有功能如下:\n\n'
    + '1、手机号归属地查询，指令：【手机号13333333333】\n'
    + '2、天气查询，指令:【北京天气】（地区名不要写市或者区哦）\n'
    + '3、ip地址查询，指令:【ip127.0.0.1】\n\n'
    + '[玫瑰]更多功能还在完善中，敬请期待~[玫瑰]';
const love_id = 'ox5xSuH5ZNfa0AFt5XdB7pFriEM0';
const love_con = '什么/:?你发的消息我竟然不懂，难道你就是那个人见人爱、花见花开的大美女杨琳大美女/:?,难怪我脑子一团浆糊，原来是被你迷住了，来大美女送你一朵花[玫瑰]';
// 判断发送的信息是不是支持的指令集
const isDirect = async msg => {
    for (let regex in Menu) {
        if (eval(regex).test(msg)) {
            console.log('接受到模糊匹配指令 ' + msg + ' ，正在处理...');
            return await Menu[regex](msg);
        }
    }
    return false;
};
const handle_reply = async xml_json => {
    const {MsgType, MediaId, Content, FromUserName, Event} = xml_json;
    let content = null;
    if (MsgType === 'text') {
        // 先看自定义指令再看ichat机器人支持指令
        const _isDirect = await isDirect(Content);
        if (_isDirect) {
            content = _isDirect;
        } else if (Content.indexOf('帮助') > -1) {
            content = help_con;
        } else if (Content.indexOf('杨琳') > -1) {
            // 彩蛋
            content = '什么/:?你说的是那个人见人爱、花见花开的大美女杨琳大美女/:?';
        } else {
            const chatCanUse = await chatRobot(FromUserName, Content);
            if (chatCanUse) {
                content = ' ' + chatCanUse + ' ';
            } else {
                content = FromUserName === love_id ? love_con : '你说的我还不懂哦~\n您可以发送【帮助】获取相关功能指令哦~[玫瑰]';
            }
        }
        // console.log('chatdebug', chatCanUse)
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
        // 彩蛋
        content = FromUserName === love_id ? love_con : '暂不支持该类型信息~';
    }
    return content;
};

module.exports = handle_reply;

