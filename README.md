
[点击查看API接口介绍](./API.md)

PS：运行方法 npm install 安装依赖
	
	
	 (1) npm run start

	 (2) pm2 start start.json --env production (需要全局安装pm2---> npm install -g pm2;若不加参数env参数则默认开发环境加了则是线上环境)


## 文件目录结构及说明
<pre>
├── app.js 程序入口配置文件
├── bin
│   └── www 服务配置（端口）
├── conf
│   └── mySql.js 数据库配置信息
├── dao 程序业务模块
│   ├── back
│   │   ├── changePwd
│   │   │   └── changePwd.js
│   │   ├── login
│   │   │   └── login.js
│   │   ├── manger
│   │   │   ├── articleDo
│   │   │   │   ├── doArticle.js
│   │   │   │   └── postArticle.js
│   │   │   └── messageDo
│   │   │       └── queryMessage.js
│   │   └── register
│   │       └── register.js
│   ├── common 公共信息模块
│   │   └── common.js
│   ├── front
│   │   ├── articleController
│   │   │   └── getArticle.js
│   │   └── message
│   │       └── message.js
│   ├── sqlMap.js
│   └── wechat
│       ├── wx_opnid
│       │   └── index.js
│       └── wx_signature
│           ├── access_token.js
│           ├── jsapi_ticket.js
│           ├── signature.js
│           └── wxconfig.js
├── log4 日志记录配置
│   └── log4.js
├── node_modules
├── package.json
├── public
│   └── favicon.ico
├── routes 路由模块
│   ├── backRouter.js
│   ├── frontRouter.js
│   ├── viewRouter.js
│   └── wechat.js
├── start.json
├── tmmp
├── util
│   └── util.js
├── views
│   ├── articlePage
│   │   └── article.ejs
│   ├── error.ejs
│   ├── index.ejs
│   └── users.ejs
└── yarn.lock
</pre>

## Mysql 表结构

### 1.user_main 用户信息表

<pre>
CREATE TABLE user_main (
	userId INT ( 10 ) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
	nickName VARCHAR ( 255 ) CHARACTER 
	SET utf8 NOT NULL COMMENT '用户名',
	regTime datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '注册时间',
	PASSWORD VARCHAR ( 255 ) CHARACTER 
	SET utf8 NOT NULL COMMENT '密码',
PRIMARY KEY ( userId ) USING BTREE 
) ENGINE = INNODB AUTO_INCREMENT = 2 DEFAULT CHARSET = latin1 ROW_FORMAT = DYNAMIC COMMENT = '管理员信息表';
</pre>

### 2.article 博文表

<pre>
CREATE TABLE `article` (
	`id` INT ( 11 ) NOT NULL AUTO_INCREMENT COMMENT '博文ID',
	`articleTitle` VARCHAR ( 255 ) CHARACTER 
	SET utf8 NOT NULL COMMENT '文章标题',
	`articleCon` text CHARACTER 
	SET utf8 NOT NULL COMMENT '博文内容',
	`createTime` datetime NOT NULL COMMENT '发布时间',
	`isShow` INT ( 11 ) NOT NULL DEFAULT '1' COMMENT '是否展示，1代表展示，0代表不展示',
PRIMARY KEY ( `id` ) USING BTREE 
) ENGINE = INNODB AUTO_INCREMENT = 7 DEFAULT CHARSET = latin1 ROW_FORMAT = DYNAMIC COMMENT = '文章内容';
</pre>

### 3.message 用户留言信息
<pre>
CREATE TABLE `message` (
	`id` INT ( 10 ) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
	`articleId` INT ( 10 ) NOT NULL COMMENT '对应文章的ID',
	`articleTitle` VARCHAR ( 255 ) CHARACTER 
	SET utf8 NOT NULL COMMENT '对应的文章标题',
	`msgCon` text CHARACTER 
	SET utf8 NOT NULL COMMENT '消息',
	`nickName` VARCHAR ( 255 ) CHARACTER 
	SET utf8 NOT NULL COMMENT '发布者',
	`createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上传或修改时间',
	`status` VARCHAR ( 255 ) CHARACTER 
	SET utf8 NOT NULL DEFAULT '0' COMMENT '信息状态：1代表显示，0代表不显示',
PRIMARY KEY ( `id` ) USING BTREE 
) ENGINE = INNODB DEFAULT CHARSET = latin1 ROW_FORMAT = DYNAMIC COMMENT = '文章留言信息';
</pre>


		

