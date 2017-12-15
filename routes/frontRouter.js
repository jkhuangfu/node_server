/**
 * 文章渲染相关API
 */
const express = require('express');
const router = express.Router();
const getArticle = require('../dao/front/articleController/getArticle');
const MessageDo = require('../dao/front/message/message');
router.post('/getMsg', (req, res, next) => {
    MessageDo.queryMessageByArticleId(req, res, next);
});
router.post('/liveMsg', (req, res, next) => {
    MessageDo.postMessageByArticleId(req, res, next);
});

module.exports = router;