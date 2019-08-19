const express = require('express');
const router = express.Router();
const checklogin = require('../middlewares/checklogin');
const articleManger = require('../src/dao/blog/article');
const messageDao = require('../src/dao/blog/message');
router.use(checklogin);
router
    .post('/changeArticleStatus', (req, res) => {
        articleManger.changeArticleStatus(req, res)
    })
    .post('/deleteArticle', (req, res) => {
        articleManger.deleteArticle(req, res)
    })
    .post('/queryArticleByType', (req, res) => {
        articleManger.queryArticleByType(req, res)
    })
    .post('/queryArticleByTitleAndStatus',(req,res)=>{
        articleManger.queryArticleByTitleAndStatus(req,res)
    })
    .post('/publishArticle',(req,res)=>{
        articleManger.publishArticle(req,res)
    })
    .post('/queryArticleById',(req,res)=>{
        articleManger.queryArticleById(req,res)
    })
    .post('/publishMessage',(req,res)=>{
        messageDao.publishMessage(req,res)
    })
    .post('/deleteMessage',(req,res)=>{
        messageDao.deleteMessage(req,res)
    })
    .post('/postMsgList',(req,res)=>{
        messageDao.getMsgList(req,res)
    })
    .post('/postMsgByTitle',(req,res)=>{
        messageDao.getMsgByTitle(req,res)
    })

module.exports = router;
