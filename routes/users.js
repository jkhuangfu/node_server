let express = require('express');
let router = express.Router();
let login = require('../dao/login/login');
let register = require('../dao/register/register');
let img = require('../dao/cacp/cacp');
let changePwd = require('../dao/changePwd/changePwd');
/* GET users listing. */
router.get('/register', function(req, res, next) {
    register.register(req, res, next);
});
router.get('/cacp', function(req, res, next) {
    let cacp = img.cacp();
    req.session.img = cacp;
    res.send(cacp);
});
router.get('/login', function(req, res, next) {
    login.login(req, res, next);
});
router.get('/changePwd', function(req, res, next) {
    console.log(req.session.userName)
    changePwd.changePwd(req, res, next);
});
//注销
router.get('/logout', function(req, res, next) {
    req.session.user = {};
    res.redirect('../')
})
module.exports = router;