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
                let res = {};
                if (data.length == 0) {
                    res.status = false;
                } else {
                    res.status = true;
                };
                res.data = data;
                reslove(res);
            });
        })
        .then(data => {
            if (data.status) {
                res.render('articlePage/article', { articleCon: data.data[0] })
            } else {
                res.render('articlePage/article', { articleCon: { articleCon: '略略略' } })
            }
        })
        .catch((err) => {
            throw new Error(err);
            res.render('error');
        })
});
module.exports = router;