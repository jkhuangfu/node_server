const nodemailer = require('nodemailer');
const mail_config = require('../../../conf/mail');
const { server_config } = mail_config;
const mailTransport = nodemailer.createTransport(server_config);
const randomCode = ()=>{
    return Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10);
};
const sendMail = (req,res)=>{
    //let param = req.query || req.params; //get请求
    let { email } = req.body;
    if(req.session.flag){
        return res.json({code:202,msg:'发送太频繁'});
    }
    let code = randomCode();
    mailTransport.sendMail({
        from: `<${server_config.auth.user}>`,
        to: email,//rescive_mail,
        subject: '邮件验证码(自动发送,勿回复)',
        //text:  '您的验证码是'+randomCode(),
        html:
        `
            <span style="color:#666;">您的验证码是:</span>
            <span style="color:red;font-size:38px;font-weight:500;margin:0 15px;">${code}</span>
            <span style="color:#666;">5分钟内有效</span>
        `
    }, (err)=>{
        if (err) {
            log4.Info('Unable to send email: ' + err);
            res.json({code:400,msg:'发送失败'});
        }else{
            req.session.flag = true;
            req.session.emailCode = code;
            redisDb.set(0,'code_t',code,5*60,(res,flag)=>{
                if(flag){
                    log4.Info(`Success------->`+code)
                    res.json({code:200,msg:'发送成功'});
                }else{
                    res.json({code:400,msg:'发送失败'});
                }
            })
        }
    });
};
module.exports = sendMail;