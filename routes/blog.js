const express = require('express');
const router = express.Router();
const checklogin = require('../middlewares/checklogin');
const {publishArticle,queryArticle,queryArticleById,deleteArticle,changeArticleStatus} = require('../src/dao/blog/article');
const { publishMessage,deleteMessage,getMsgByTitle,getMsgList } = require('../src/dao/blog/message');
router
    .use(checklogin)
    .post('/changeArticleStatus', (req, res) => {
        changeArticleStatus(req, res);
    })
    .post('/deleteArticle', (req, res) => {
        deleteArticle(req, res);
    })
    .post('/queryArticle',(req,res)=>{
        queryArticle(req,res);
    })
    .post('/publishArticle',(req,res)=>{
        publishArticle(req,res);
    })
    .post('/queryArticleById',(req,res)=>{
        queryArticleById(req,res);
    })
    .post('/publishMessage',(req,res)=>{
        publishMessage(req,res);
    })
    .post('/deleteMessage',(req,res)=>{
        deleteMessage(req,res);
    })
    .post('/postMsgList',(req,res)=>{
        getMsgList(req,res);
    })
    .post('/postMsgByTitle',(req,res)=>{
        getMsgByTitle(req,res);
    })

module.exports = router;
