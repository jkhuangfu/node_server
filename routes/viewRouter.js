var express = require('express');
var router = express.Router();
const getArticle = require('../dao/front/articleController/getArticle');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
//文章路由
router.get('/article/:id', (req, res, next) => {
    let id = req.params.id;
    /**
     * @Des 文章获取模块
     */
    new Promise((reslove, reject) => {
            getArticle.queryArticleById(id, data => {
                if (data.length == 0) {
                    res.redirect('/');
                    return;
                }
                reslove(data);
            });
        })
        .then(data => {
            res.render('articlePage/article', { articleCon: data[0] })
        })
        .catch((err) => {
            throw new Error(err);
            res.render('error');
        })
});
module.exports = router;