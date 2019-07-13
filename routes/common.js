const  express = require('express');
const router = express.Router();
const captcha = require('../src/dao/common/cacp');
const upFile = require('../src/dao/common/upFile');
const { sendMailCode,sendMailNormal } = require('../src/dao/common/sendMail');
const multer = require('multer'); //文件上传
const upload = multer({ dest: './tmmp/' });

router.get('/cacp',(req,res)=>{
    captcha(req,res)
});

router.get('/sendMailCode',(req,res)=>{
    sendMailCode(req,res)
});
router.get('/sendMailNormal',(req,res)=>{
    sendMailNormal(req,res)
});
router.post('/upFile', upload.single('file'), (req, res, next) => {
    log4.Info('======开始上传文件=====');
    try {
        upFile.upFile(req, res, next);
    } catch (err) {
        log4.writeErr(err)
    }

});
module.exports = router;