const node_mailer = require('nodemailer');
const mail_config = require('../../config/mail');
const { server_config } = mail_config;
const mailTransport = node_mailer.createTransport(server_config);
const randomCode = () => {
    return (
        Math.floor(Math.random() * 10) +
        '' +
        Math.floor(Math.random() * 10) +
        '' +
        Math.floor(Math.random() * 10) +
        '' +
        Math.floor(Math.random() * 10)
    );
};
const sendFunction = async (email, code) => {
    return new Promise(resolve => {
        mailTransport.sendMail(
            {
                from: `Dr丶net<${server_config.auth.user}>`,
                to: email, //rescive_mail,
                subject: '邮件验证码(自动发送,勿回复)',
                //text:  '您的验证码是'+randomCode(),
                html: `
                <span style="color:#666;">您的验证码是:</span>
                <span style="color:red;font-size:38px;font-weight:500;margin:0 15px;">${code}</span>
                <span style="color:#666;">5分钟内有效</span>
            `
            },
            async err => {
                if (err) {
                    log4.Info('Unable to send email: ' + err);
                    resolve({ code: 400, msg: '发送失败' });
                } else {
                    const getCount = await redisDb.get(`${email}_count`);
                    const sendCounts = getCount ? getCount : 0;
                    if (sendCounts >= 5) {
                        resolve({ code: 201, msg: '超过发送次数，明日再试' });
                        return;
                    }
                    const count = sendCounts - 0 + 1;
                    const oneDay = 24 * 60 * 60;
                    const now = new Date();
                    const nowSecond = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
                    const set_key = await redisDb.set(email, code, 5 * 60);
                    const set_count = await redisDb.set(`${email}_count`, count, oneDay - nowSecond);
                    if (set_key === 200 && set_count === 200) {
                        resolve({ code: 200, msg: '发送成功' });
                    }
                }
            }
        );
    });
};
const sendMailCode = async ctx => {
    const { email } = reqBody(ctx);
    const { nickName } = ctx.session.user;
    // const nickName = 'Admin';
    const code = randomCode();
    const sql = 'select email from user_main where nickName = ?';
    const db = await dbquery(sql, [nickName]);
    if (db.code !== 200) {
        ctx.body = db;
        return false;
    }
    const res = db.result[0].email;
    if (res === email) {
        ctx.body = await sendFunction(email, code);
        return false;
    }
    ctx.body = {
        code: 201,
        msg: ' 邮箱不匹配'
    }

};
const sendMailNormal = async ctx => {
    const { to, mailCon, mailType = 'text' } = reqBody(ctx);
    let con = {
        html: mailCon
    };
    if (mailType === 'text') {
        con = {
            text: mailCon
        };
    }
    try {
        const flag = await new Promise(resolve => {
            mailTransport.sendMail(
                {
                    from: `<${server_config.auth.user}>`,
                    to: to,
                    subject: 'no reply(自动发送,勿回复)',
                    ...con
                },
                err => {
                    if (err) {
                        resolve(err);
                    } else {
                        resolve(200);
                    }
                }
            );
        });
        if (flag === 200) {
            ctx.body = { code: 200, msg: 'success' };
            return false;
        }
        ctx.body = { code: 500, msg: flag };
    } catch (e) {
        ctx.body = { code: 500, msg: '程序异常，发送失败', e };
    }
};
module.exports = { sendMailCode, sendMailNormal };
