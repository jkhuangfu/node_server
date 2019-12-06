const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const {uuid} = require('../../util/inedx');
const oss_config = require('../../config/ali_oss');
// 初始化Client
const client = new OSS(oss_config);
module.exports = {
    upFileForLocal: async (req, res) => {
        let writeStream = [], url = [], promise = [];
        const {type} = reqBody(req);
        if (req.files.length <= 0) {
            res.json({status: 400, msg: '未上传文件'});
            return false;
        }
        req.files.map(item => {
            let file_type = item.originalname.split('.').pop();
            let id = uuid(36);
            //创建真实文件
            let write_file = path.resolve('public/upload', `${type ? type : id}.${file_type}`);
            // 本地缓存数据
            let local_file = path.resolve('public/upload', item.filename);
            let origin_stream = fs.createReadStream(local_file);
            let write_stream = fs.createWriteStream(write_file);
            writeStream.push({
                local_file, origin_stream, write_stream
            });
            url.push(`/upload/${type ? type : id}.${file_type}`);
        });

        writeStream.map(item => {
            promise.push(new Promise(resolve => {
                item.origin_stream.pipe(item.write_stream);
                item.origin_stream.on('end', () => {
                    resolve(true);
                });
            }))
        });
        const flag = await Promise.all(promise);
        if (!flag.includes('false')) {
            writeStream.map(item => {
                fs.unlinkSync(item.local_file);
            });
            res.json({code: 200, message: 'success', url})
        }
    },
    upFileForOss: (req, res) => {
        let file_arr = [], result_arr = [], promise = [];
        let {type} = reqBody(req);
        if (req.files.length <= 0) {
            res.json({status: 400, msg: '未上传文件'});
            return false;
        }
        req.files.map(item => {
            let file_type = item.originalname.split('.').pop();
            let fileName = type ? `${type}.${file_type}` : item.originalname;
            let key = `upload/${fileName}`;
            let or_file = path.resolve("public/upload", item.filename);
            let stream = fs.createReadStream(or_file);
            promise.push(client.putStream(key, stream));
            file_arr.push(or_file);
        });
        Promise.all(promise).then(data => {
            data.map((item, index) => {
                result_arr.push(item.url.replace('http:', ''));
                fs.unlinkSync(file_arr[index]);
            });
            res.json({code: 200, msg: '上传成功', imageUrlArr: result_arr});
        }).catch(e => {
            file_arr.map(item => {
                fs.unlinkSync(item);
            });
            res.json({code: 500, e});
        });
    }
};
