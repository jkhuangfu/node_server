>此项目使用技术栈为 node express mysql express-session redis express-router

PS：运行方法 npm install 安装依赖
	
	 (1) npm run start

	 (2) pm2 start start.json --env production (需要全局安装pm2---> npm install -g pm2;若不加参数env参数则默认开发环境加了则是线上环境)

## 文件结构说明
```
├── app.js //主程序配置
├── bin
│   └── www //服务配置
├── fileTemp //文件上传（缓存）
├── package.json
├── public
│   ├── favicon.ico
│   └── test.txt
├── routes
│   ├── blog.js //blog 路由
│   ├── common.js //公用功能路由
│   ├── user.js //用户操作路由
│   ├── viewRouter.js //前端页面路由(ejs模板)
│   └── wechat.js //微信相关路由
├── src
│   ├── config //相关配置信息(mysql,redis,邮箱,微信 appid 等)
│   │   ├── mail.js
│   │   ├── mySql.js
│   │   ├── redis.js
│   │   └── wxconfig.js
│   ├── dao
│   │   ├── blog //blog 相关控制（文章，留言）
│   │   │   ├── article.js
│   │   │   └── message.js
│   │   ├── common //公用模块抽离(验证码，邮箱发送，文件上传)
│   │   │   ├── cacp.js
│   │   │   ├── sendMail.js
│   │   │   └── upFile.js
│   │   ├── user //用户信息操作（登录，注册，密码修改）
│   │   │   ├── changePwd.js
│   │   │   ├── login.js
│   │   │   └── register.js
│   │   └── wechat
│   │       ├── wx_opnid //获取微信 openid
│   │       │   └── index.js
│   │       └── wx_signature //微信公众号签名
│   │           ├── access_token.js
│   │           ├── jsapi_ticket.js
│   │           └── signature.js
│   ├── global //全局变量及方法
│   │   ├── index.js
│   │   └── redisTool.js
│   ├── socket //socket配置信息
│   │   ├── socket.io.js
│   │   └── websocket.js
│   ├── sql //抽离出的 sql 语句
│   │   └── sqlMap.js
│   └── util //工具类
│       ├── inedx.js
│       └── log4.js
├── start.json //pm2启动配置文件
├── views //前端 ejs 文件
│   ├── articlePage
│   │   └── article.ejs
│   ├── error.ejs
│   ├── index.ejs
│   └── users.ejs
└── yarn.lock
```



		

