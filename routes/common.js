const  express = require('express');
const router = express.Router();
const captcha = require('../src/dao/common/cacp');
const { sendMailCode,sendMailNormal } = require('../src/dao/common/sendMail')
router.get('/cacp',(req,res)=>{
    captcha(req,res)
});

router.get('/sendMailCode',(req,res)=>{
    sendMailCode(req,res)
});
router.get('/sendMailNormal',(req,res)=>{
    sendMailNormal(req,res)
});
module.exports = router;