>此项目使用技术栈为 node express mysql express-session redis express-router socket.io websocket

>koa版本: [点击查看koa版本](https://github.com/jkhuangfu/node_server/tree/koa-version)

PS：运行方法 npm install 安装依赖
	
	 (1) npm run start

	 (2) pm2 start start.json --env production (需要全局安装pm2---> npm install -g pm2;若不加参数env参数则默认开发环境加了则是线上环境)

## 文件结构说明
```
├── app.js //主程序配置
├── bin
│   └── www //服务配置
├── middlewares //中间件
├── package.json
├── public
│   ├── favicon.ico
│   └── test.txt
├── routes // 路由相关
├── sql
│   ├── blog.sql //数据库结构文件
├── src
│   ├── config //相关配置信息(mysql,redis,邮箱,微信 appid 等)
│   ├── dao
│   │   ├── blog //blog 相关控制（文章，留言）
│   │   ├── common //公用模块抽离(验证码，邮箱发送，文件上传)
│   │   ├── user //用户信息操作（登录，注册，密码修改）
│   │   └── wechat
│   │       ├── robot //微信公众号自动回复相关功能模块
│   │       ├── service //微信公众号服务接口（包含token校验）
│   │       ├── util //微信相关工具类（获取access_token,jsapi_ticket）
│   │       ├── signature.js // 微信js-sdk签名
│   │       └── getOpenid.js // 获取openid(网页授权等可用)
│   ├── socket //socket配置信息
│   │   ├── socket.io.js
│   │   └── websocket.js
│   └── util //工具类集合(其中大部分挂载到node全局变量--global上)
├── start.json //pm2启动配置文件
├── views //前端 ejs 文件
└── yarn.lock
```



		

