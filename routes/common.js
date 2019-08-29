const express = require('express');
const router = express.Router();
const checklogin = require('../middlewares/checklogin');
const captcha = require('../src/dao/common/cacp');
const {upFileForOss, upFileForLocal} = require('../src/dao/common/upFile');
const {sendMailCode, sendMailNormal} = require('../src/dao/common/sendMail');
const multer = require('multer');
const upload = multer({
    limits:{
        fileSize: 600 * 1024 // 限制文件为600kb
    },
    dest: './fileTemp/'
});

router
    .use(checklogin)
    .get('/cacp', (req, res) => {
        captcha(req, res);
    })
    .post('/sendMailCode', (req, res) => {
        sendMailCode(req, res);
    })
    .post('/sendMailNormal', (req, res) => {
        sendMailNormal(req, res);
    })
    //上传文件到阿里OSS
    .post('/oss/upFile', upload.array('file', 9), (req, res) => {
        upFileForOss(req, res);
    })
    //上传文件到本地
    .post('/local/upFile', upload.array('file', 9), (req, res) => {
        upFileForLocal(req, res);
    });
module.exports = router;
