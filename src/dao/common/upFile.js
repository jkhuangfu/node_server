const OSS = require('ali-oss');
const fs = require('fs');
// 初始化Client
const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI1B20tWL79mBa',
    accessKeySecret: 'NZIW37bBgMTMExG1V4O4129LrrfVCW',
    bucket: 'blog-manger'
});
module.exports = {
    upFileForLocal: async (req, res) => {
        let writeStream = [];
        if(req.files.length<=0){
            res.json({status: 400, msg: '未上传文件'});
            return
        }
        req.files.map(item=>{
            let write_file = './fileTemp/'+item.originalname;
            let local_file = './fileTemp/'+item.filename;
            let origin_stream = fs.createReadStream(local_file);
            let write_stream = fs.createWriteStream(write_file);
            writeStream.push({
                local_file,origin_stream,write_stream
            });
        });
        await Promise.all(writeStream.map(item=>{
            item.origin_stream.pipe(item.write_stream);
            fs.unlinkSync(item.local_file);
        }));
        res.json({code:200,message:'success'})
    },
    upFileForOss: async (req, res) => {
        let file_arr = [],result_arr=[];
        if(req.files.length<=0){
            res.json({status: 400, msg: '未上传文件'});
            return
        }
        req.files.map(item => {
            let key = 'articleImg/' + item.originalname;
            let or_file = "./fileTemp/" + item.filename;
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