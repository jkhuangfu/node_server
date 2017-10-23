var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    if (req.session.user) {
        console.log('已登录')
    } else {
        console.log('未登录')
    }
});

module.exports = router;