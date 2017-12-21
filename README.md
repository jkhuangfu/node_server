# node_express_mySQL
个人学习Demo

此分之为session版本

增加微信 js-sdk

PS：运行方法 npm install 安装依赖
	
	
	 (1) npm run start

	 (2) pm2 start start.json (需要全局安装pm2 npm install -g pm2)

Mysql 表结构

1.user_main 用户信息表

CREATE TABLE `user_main` (
  `userId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `nickName` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '用户名',
  `regTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '注册时间',
  `passWord` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '密码',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

2.article 博文表

CREATE TABLE `article1` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '博文ID',
  `articleTitle` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '文章标题',
  `articleCon` text CHARACTER SET utf8 NOT NULL COMMENT '博文内容',
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '发布时间',
  `isShow` int(11) NOT NULL DEFAULT '1' COMMENT '是否展示，1代表展示，0代表不展示',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

3.message 用户留言信息

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

		

