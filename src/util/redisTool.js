const redis = require('redis');
const redisConfig = require('../config/redis');
const redisDb = app => {
  const { ip, port } = app['env'] === 'development' ? redisConfig.configDev : redisConfig.configProd;
  const client = redis.createClient(port, ip);
  client.on('error', err => {
    log4.Info('redis error：' + err);
  });
  client.on('connect', () => {
    log4.Info('redis连接成功...');
  });
  /**
   * @description 设置键值对
   * @param key 键
   * @param value 值
   * @param expire 过期时间（单位：秒，可为空，为空则不过期）
   * @return 200
   */
  const set = (key, value, expire) => {
    return new Promise(reslove => {
      client.set(key, value, (err, result) => {
        if (err) {
          log4.Info('redis插入失败：' + err);
          reslove(err);
          return false;
        }
        if (!isNaN(expire) && expire > 0) {
          client.expire(key, parseInt(expire));
        }
        reslove(200);
      });
    });
  };

  /**
   * @description 获取对应value
   * @param key 键
   * @return Promise<Boolean>
   */
  const get = key => {
    return new Promise(reslove => {
      client.get(key, (err, result) => {
        if (err) {
          log4.Info('redis获取失败：' + err);
          reslove(err);
          return false;
        }
        reslove(result);
      });
    });
  };

  /**
   * @description 判断是否存在该key
   * @param key
   * @return Promise<unknown>
   */

  const exits = key => {
    return new Promise(resolve => {
      client.exists(key, (err, reply) => {
        if (err) {
          resolve(err);
          return false;
        }
        if (reply === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  /**
   * @description 根据key值删除数据
   * @param keys 要删除的key 单个为String 多个为Array[key1,key2]
   * @return Promise<unknown>
   */

  const del = keys => {
    return new Promise(resolve => {
      client.del(keys, (err, val) => {
        if (err) {
          resolve(false);
        } else if (val >= 1) {
          resolve(true);
        }
      });
    });
  };

  return { set, get, del, exits };
};

module.exports = redisDb;
