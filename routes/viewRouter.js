const express = require('express');
const router = express.Router();
const fs = require('fs');

/* 微信txt文件验证专用 txt文件放置在public文件根目录 */
const render = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('/test.txt', "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};
router
    .get('/test.txt', async (req, res) => {
        let html = await render();
        res.render(html);
    })
    /* GET home page. */
    .get('/', (req, res, next) => {
        res.render('index');
    })
    /* to 404 page */
    .get('/notFound', (req, res, next) => {
        res.render('error');
    });
module.exports = router;
