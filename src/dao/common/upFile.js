const OSS = require('ali-oss');
const fs = require('fs');
// 初始化Client
const co = require('co');
const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LT********a',
    accessKeySecret: 'N************************CW'
});
const ali_oss = {
    bucket: 'blog-manger',
    endPoint: 'oss-cn-beijing.aliyuncs.com',
};
module.exports = {
    upFile: (req, res, next) => {
        // 文件路径;
        var filePath = './' + req.file.path;
        // 文件类型
        var temp = req.file.originalname.split('.');
        var fileType = temp[temp.length - 1];
        var lastName = '.' + fileType;
        // 构建图片名
        var fileName = Date.now() + lastName;
        // 图片重命名
        fs.rename(filePath, fileName, (err) => {
            if (err) {
                res.end(JSON.stringify({ status: '102', msg: '文件写入失败' }));
            } else {
                var localFile = './' + fileName;
                var key = 'articleImg/' + fileName; //存放bucket子目录
                // 阿里云 上传文件
                co(function*() {
                    client.useBucket(ali_oss.bucket);
                    var result = yield client.put(key, localFile);
                    var imageSrc = 'http://img.drnet.xyz/' + result.name;
                    // 上传之后删除本地文件
                    fs.unlinkSync(localFile);
                    res.end(JSON.stringify({ status: '100', msg: '上传成功', imageUrl: imageSrc }));
                }).catch(function(err) {
                    // 上传之后删除本地文件
                    fs.unlinkSync(localFile);
                    res.end(JSON.stringify({ status: '101', msg: '上传失败', error: JSON.stringify(err) }));
                });
            }
        });
    }
}