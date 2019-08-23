/*
 Navicat Premium Data Transfer

 Source Server         : local_mysql
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 25/07/2019 09:47:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '博文ID',
  `articleTitle` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '文章标题',
  `articleCon` text CHARACTER SET utf8 NOT NULL COMMENT '博文内容',
  `createTime` datetime NOT NULL COMMENT '发布时间',
  `isShow` int(11) NOT NULL DEFAULT '1' COMMENT '是否展示，1代表展示，0代表不展示',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC COMMENT='文章内容';

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `articleId` int(10) NOT NULL COMMENT '对应文章的ID',
  `articleTitle` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '对应的文章标题',
  `msgCon` text CHARACTER SET utf8 NOT NULL COMMENT '消息',
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上传或修改时间',
  `status` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '0' COMMENT '信息状态：1代表显示，0代表不显示',
  `ip` varchar(255) DEFAULT NULL COMMENT '用户 ip 信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC COMMENT='文章留言信息';

-- ----------------------------
-- Table structure for user_main
-- ----------------------------
DROP TABLE IF EXISTS `user_main`;
CREATE TABLE `user_main` (
  `userId` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `nickName` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '用户名',
  `regTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '注册时间',
  `passWord` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '密码',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱信息',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像',
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC COMMENT='管理员信息表';

SET FOREIGN_KEY_CHECKS = 1;
