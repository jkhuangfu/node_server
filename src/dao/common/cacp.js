const svgCaptcha = require('svg-captcha'); //验证码组件
const captcha = (req, res) => {
    let captcha = svgCaptcha.createMathExpr({
        noise: 3,
        color: true
    });
    log4.Info('======获取验证码=====' + captcha.text);
    req.session.img = captcha.text;
    res.type('svg');
    res.send(captcha.data);
};
module.exports = captcha;
