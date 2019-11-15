>此项目使用技术栈为 node koa2 mysql koa-session redis koa-router socket.io websocket

>Express版本: [点击查看Express版本](https://github.com/jkhuangfu/node_server/tree/master)

### 运行前准备
    
    1、安装node（>8版本）
    
    2、安装redis
    
    3、安装mysql
    
    4、创建blog数据库并创建相关表（表结构在sql/blog.sql）
    
### 运行说明
	
	 (1) npm install | yarn install
	
	 (2) npm run dev(development) | npm run start(production)

	 (3) pm2 start start.json --env production (需要全局安装pm2---> npm install -g pm2;若不加参数env参数则默认开发环境加了则是线上环境)
