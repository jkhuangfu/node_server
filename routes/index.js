var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//var ip = req.ip;
//res.render('index', { title: ip });
//});
router.get('/t/:name', function(req, res, next) {
    var ip = req.ip;
    var s = req.params.name;
    console.log(s)
    res.render('index', {
        title: ip
    });
});
module.exports = router;