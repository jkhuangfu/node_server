const express = require('express');
const router = express.Router();
const fs = require('fs');
const getArticle = require('../dao/front/articleController/getArticle');

/* 微信txt文件验证专用 txt文件放置在public文件根目录 */
const render = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('/MP_verify_tGmHaGktkQYkf6kr.txt', "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};
const route = async(url) => {
    let html = await render()
    return html
};
router.get('/MP_verify_tGmHaGktkQYkf6kr.txt', async(req, res, next) => {
    let html = await route();
    res.render(html);
});

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index');
});
/* to 404 page */
router.get('/notFound', (req, res, next) => {
    res.render('error');
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
                res.redirect('/notFound')
            }
        })
        .catch((err) => {
            throw new Error(err);
            res.redirect('/notFound')
        })
});
module.exports = router;