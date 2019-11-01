const svgCaptcha = require('svg-captcha'); //验证码组件
const captcha = async ctx => {
    let captcha = svgCaptcha.createMathExpr({
        noise: 3,
        color: true
    });
    log4.Info('======获取验证码=====' + captcha.text);
    ctx.session.img = captcha.text;
    ctx.body = captcha.data;
};
module.exports = captcha;
