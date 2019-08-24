const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const { uuid } = require('../../util/inedx');
// 初始化Client
const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: '*******',
    accessKeySecret: '**********',
    bucket: 'blog-manger'
});
module.exports = {
    upFileForLocal: async (req, res) => {
        let writeStream = [],url = [];
        let { type } = reqBody(req);
        if(req.files.length<=0){
            res.json({status: 400, msg: '未上传文件'});
            return false;
        }
        req.files.map(item=>{
            let file_type = item.originalname.split('.')[1];
            let id = uuid(36);
            //创建真实文件
            let write_file = path.resolve('fileTemp',`${type ? type : id}.${file_type}`);
            // 本地缓存数据
            let local_file = path.resolve('fileTemp',item.filename);
            let origin_stream = fs.createReadStream(local_file);
            let write_stream = fs.createWriteStream(write_file);
            writeStream.push({
                local_file,origin_stream,write_stream
            });
            url.push(`/img/${type ? type : id}.${file_type}`);
        });
        await Promise.all(writeStream.map(item=>{
            !fs.existsSync(item.write_file) && item.origin_stream.pipe(item.write_stream);
            fs.unlinkSync(item.local_file);
        }));
        res.json({code:200,message:'success',url})
    },
    upFileForOss: async (req, res) => {
        let file_arr = [],result_arr=[];
        if(req.files.length<=0){
            res.json({status: 400, msg: '未上传文件'});
            return
        }
        req.files.map(item => {
            let key = 'articleImg/' + item.originalname;
            let or_file = path.resolve("fileTemp",item.filename);
            let stream = fs.createReadStream(or_file);
            file_arr.push({
                key, stream
            });
            fs.unlinkSync(or_file);
        });
        await Promise.all(
            file_arr.map(async item => {
                let result = await client.putStream(item.key, item.stream);
                result_arr.push(result.url)
            })
        );
        res.json({status: 200, msg: '上传成功', imageUrlArr: result_arr});
    }
};
