/*
 Navicat Premium Data Transfer

 Source Server         : Local
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 14/11/2019 15:26:54
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC COMMENT='文章内容';

-- ----------------------------
-- Table structure for cash_user
-- ----------------------------
DROP TABLE IF EXISTS `cash_user`;
CREATE TABLE `cash_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL COMMENT '用户名',
  `pass_word` varchar(255) DEFAULT NULL COMMENT '密码',
  `user_openid` varchar(255) DEFAULT NULL COMMENT '用户微信id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cashbook
-- ----------------------------
DROP TABLE IF EXISTS `cashbook`;
CREATE TABLE `cashbook` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL COMMENT ' 微信openid',
  `date` datetime NOT NULL COMMENT '消费日期',
  `money` varchar(255) NOT NULL COMMENT '消费金额',
  `des` varchar(255) NOT NULL COMMENT '消费描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for city
-- ----------------------------
DROP TABLE IF EXISTS `city`;
CREATE TABLE `city` (
  `id` varchar(32) NOT NULL,
  `cityEn` varchar(32) NOT NULL,
  `cityZh` varchar(32) NOT NULL,
  `provinceEn` varchar(32) NOT NULL,
  `provinceZh` varchar(32) NOT NULL,
  `countryEn` varchar(32) NOT NULL,
  `countryZh` varchar(32) NOT NULL,
  `leaderEn` varchar(32) NOT NULL,
  `leaderZh` varchar(32) NOT NULL,
  `lat` varchar(32) NOT NULL,
  `lon` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城市表';

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
-- Table structure for taobao_table_detail
-- ----------------------------
DROP TABLE IF EXISTS `taobao_table_detail`;
CREATE TABLE `taobao_table_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `local_price` varchar(20) DEFAULT NULL COMMENT '本店价格',
  `from_price` varchar(10) DEFAULT NULL COMMENT '总店价格',
  `local_trans_id` int(50) DEFAULT NULL COMMENT '本店交易id',
  `from_trans_id` int(50) DEFAULT NULL COMMENT '总店交易id',
  `express_id` int(50) DEFAULT NULL COMMENT '快递单号',
  `pub_fee` varchar(255) DEFAULT '0' COMMENT '联盟佣金',
  `status` varchar(255) DEFAULT NULL COMMENT '订单状态(0:未采购,1:已采购未发货,2:退款,3:换货,4:完成)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for taobao_user
-- ----------------------------
DROP TABLE IF EXISTS `taobao_user`;
CREATE TABLE `taobao_user` (
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_name`,`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
