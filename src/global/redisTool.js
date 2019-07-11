const redis = require("redis");
const redisConfig = require('../config/redis');
const redisDb = (app) => {
    let env = app.get('env');
    let _redisConfig = {};
    if(env === 'development'){
        _redisConfig = redisConfig.configDev
    }else {
        _redisConfig = redisConfig.configProd
    }
    let { ip ,port } = _redisConfig;
    const client = redis.createClient(port, ip);
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
    const set =  (dbNum,key,value,expire,callback) => {
        client.select(dbNum, (err) =>{
            if (err){
                log4.error('redis set 选库失败：'+err);
            }else {
                client.set(key,value,(err,result) => {
                    if (err){
                        log4.error('redis插入失败：'+err);
                        callback && callback(err,false);
                        return
                    }
                    if (!isNaN(expire) && expire>0){
                        client.expire(key, parseInt(expire));
                    }
                    callback && callback(result,true);
                })
            }
        })
    };

    const get = (dbNum,key) => {
        return new Promise((res,rej)=>{
            client.select(dbNum, (err) => {
                if (err){
                    log4.error('redis get 选库失败：'+err);
                    res(err)
                }else {
                    client.get(key,(_err,result)=> {
                        if (_err){
                            log4.error('redis获取失败：'+err);
                            res(err)
                            return
                        }
                        res(result)
                    })
                }
            })
        })
    };
    return { set , get }
};

module.exports = redisDb;
