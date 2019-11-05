const OSS = require('ali-oss');
const fs = require('fs');
const oss_config = require('../../config/ali_oss');
// 初始化Client
const client = new OSS(oss_config);
module.exports = {
    upFileForLocal: async ctx => {
        let write_stream = [],
            url = [],
            promise = [],
            file_array = [];
        const {type = null} = ctx.request.body;
        const files = ctx.request.files.file; // 获取上传文件
        const isArray = Array.isArray(files);
        if (!isArray) {
            file_array.push(files);
        } else {
            file_array = [...files];
        }
        file_array.map(item => {
            const origin_path = `../../public/upload/${item.path.split('/').pop()}`; // 原始文件名路径
            // 用户自定义名字--->单文件上传
            if (type && file_array.length === 1) {
                const ext = item.name.split('.').pop(); // 获取上传文件扩展名
                const reader = fs.createReadStream(item.path); // 创建可读流
                const upStream = fs.createWriteStream(`../../public/upload/${type}.${ext}`); // 创建可写流
                // 本地缓存数据
                const local_file = item.path;
                write_stream.push({
                    local_file,
                    reader,
                    upStream
                });
                url.push(`/upload/${type}.${ext}`);
            } else {
                url.push(origin_path);
            }
        });
        write_stream.map(item => {
            promise.push(
                new Promise(resolve => {
                    item.reader.pipe(item.upStream);
                    item.reader.on('end', () => {
                        resolve(true);
                    });
                })
            );
        });
        const flag = await Promise.all(promise);
        if (!flag.includes('false')) {
            // 删除本地缓存数据
            if (type && file_array.length === 1) {
                write_stream.map(item => {
                    fs.unlinkSync(item.local_file);
                });
            }
            ctx.body = {code: 200, message: 'success', url};
            return true;
        }
        ctx.body = {code: 202, message: '未全部成功', url};
    },
    upFileForOss: async ctx => {
        let local_array = [],
            promise = [],
            file_array = [],
            result_arr = [];
        const {type = null} = ctx.request.body;
        const files = ctx.request.files.file; // 获取上传文件
        const isArray = Array.isArray(files);
        if (!isArray) {
            file_array.push(files);
        } else {
            file_array = [...files];
        }
        file_array.map(item => {
            const ext = item.name.split('.').pop(); // 获取上传文件扩展名
            const upStream = fs.createReadStream(item.path); // 创建可读
            // 本地缓存数据
            const local_file = item.path;
            local_array.push({
                local_file
            });
            // 用户自定义名字--->单文件上传
            if (type && file_array.length === 1) {
                const key = `articleImg/${type}.${ext}`;
                promise.push(client.putStream(key, upStream)); // 上传至oss
            } else {
                const key = `articleImg/${item.path.split('/').pop()}`;
                promise.push(client.putStream(key, upStream)); // 上传至oss
            }
        });
        await Promise.all(promise)
            .then(data => {
                data.map((item, index) => {
                    result_arr.push(item.url.replace('http:', ''));
                    fs.unlinkSync(local_array[index].local_file);
                });
                ctx.body = {code: 200, msg: '上传成功', imageUrlArr: result_arr};
            })
            .catch(e => {
                local_array.map(item => {
                    fs.unlinkSync(item.local_file);
                });
                ctx.body = {code: 500, e};
            });
    }
};
