# node_express_mySQL

PS：运行方法 npm install 安装依赖
	
	
	 (1) npm run start

	 (2) pm2 start start.json --env production (需要全局安装pm2---> npm install -g pm2;若不加参数env参数则默认开发环境加了则是线上环境)


## 文件目录结构及说明
<pre>
├── app.js #入口配置文件
├── bin
│   └── www #端口号配置文件,默认3330
├── conf
│   └── mySql.js #数据库连接信息（账号密码及数据库名）
├── dao
│   ├── back #后台API
│   │   ├── changePwd
│   │   │   └── changePwd.js #修改密码API
│   │   ├── login
│   │   │   └── login.js  #登录API
│   │   ├── manger
│   │   │   ├── articleDo
│   │   │   │   ├── doArticle.js  #文章管理API
│   │   │   │   └── postArticle.js  #文章发布API （包含阿里OSS APPID及secret配置）
│   │   │   └── messageDo
│   │   │       └── queryMessage.js  #留言管理API
│   │   └── register
│   │       └── register.js #注册API
│   ├── common
│   │   └── common.js #公共方法或变量信息
│   ├── front #前端API
│   │   ├── articleController
│   │   │   └── getArticle.js #文章获取API
│   │   └── message
│   │       └── message.js #消息获取API
│   ├── sqlMap.js #简单sql语句
│   └── wxShare #微信JS-SDK
│       ├── signature.js #签名
│       └── wxconfig.js #微信公众号信息配置文件
├── log4
│   └── log4.js #日志配置文件
├── package.json
├── package-lock.json
├── public #静态资源文件（js css img）
│   └── favicon.ico
├── routes
│   ├── backRouter.js #后端API路由
│   ├── frontRouter.js #前端渲染路由
│   └── viewRouter.js #PM2启动配置文件
├── start.json #PM2启动配置文件
├── tmmp #阿里OSS文件上传临时目录
├── util
│   └── util.js
└── views #前端页面（默认ejs引擎可在app.js配置修改）
</pre>

## Mysql 表结构

### 1.user_main 用户信息表

CREATE TABLE `user_main` (
  `userId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `nickName` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '用户名',
  `regTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '注册时间',
  `passWord` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '密码',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

### 2.article 博文表

CREATE TABLE `article1` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '博文ID',
  `articleTitle` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '文章标题',
  `articleCon` text CHARACTER SET utf8 NOT NULL COMMENT '博文内容',
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '发布时间',
  `isShow` int(11) NOT NULL DEFAULT '1' COMMENT '是否展示，1代表展示，0代表不展示',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

### 3.message 用户留言信息

CREATE TABLE `message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `articleId` int(10) NOT NULL COMMENT '对应文章的ID',
  `articleTitle` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '对应的文章标题',
  `msgCon` text CHARACTER SET utf8 NOT NULL COMMENT '消息',
  `nickName` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '发布者',
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上传或修改时间',
  `status` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '0' COMMENT '信息状态：1代表显示，0代表不显示',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

		

