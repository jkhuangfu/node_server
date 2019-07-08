const redisDb = {};
const redis = require("redis");
const client = redis.createClient('6379', '127.0.0.1');

client.on('error', (err) => {
    log4.Info('redis error：'+err);
});

client.on('connect',() => {
    log4.Info('redis连接成功...')
});

/**
 *
 * @param dbNum 库号
 * @param key 键
 * @param value 值
 * @param expire 过期时间（单位：秒，可为空，为空则不过期）
 * @param callback 回调
 */
redisDb.set =  (dbNum,key,value,expire,callback) => {
    client.select(dbNum, (err) =>{
        if (err){
            log4.error('redis set 选库失败：'+err);
        }else {
            client.set(key,value,(err,result) => {
                if (err){
                    log4.error('redis插入失败：'+err);
                    callback(err,false);
                    return
                }
                if (!isNaN(expire) && expire>0){
                    client.expire(key, parseInt(expire));
                }
                callback(result,true);
            })
        }
    })
};

redisDb.get = (dbNum,key,callback) => {
    client.select(dbNum, (err) => {
        if (err){
            log4.error('redis get 选库失败：'+err);
        }else {
            client.get(key,(err,result)=> {
                if (err){
                    log4.error('redis获取失败：'+err);
                    callback(err,false);
                    return
                }
                callback(result,true);
            })
        }
    })
};

module.exports = redisDb;
