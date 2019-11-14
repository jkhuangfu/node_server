const express = require('express');
const router = express.Router();
const checklogin = require('../middlewares/checklogin');
const {publishArticle,queryArticle,queryArticleById,deleteArticle,changeArticleStatus} = require('../models/blog/article');
const { publishMessage,deleteMessage,queryMessage,changeMessageStatus } = require('../models/blog/message');
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
    .post('/changeMessageStatus',(req,res)=>{
        changeMessageStatus(req,res)
    })
    .post('/queryMessage',(req,res)=>{
        queryMessage(req,res);
    });

module.exports = router;
