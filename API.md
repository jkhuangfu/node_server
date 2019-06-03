# 相关接口描述

`1、注册接口 /users/register`
<pre>
    // post请求
    data:{
        nickName:'用户名',
        passWord:'密码',
        img:'验证码'
    }
</pre>
`2、登录接口 /users/login`
<pre>
    // post请求
    data:{
        nickName:'用户名',
        passWord:'密码',
        img:'验证码'
    }
</pre>
`3、图片验证码接口 /users/cacp`
<pre>
    // get请求
    无需传参
</pre>
`4、修改密码接口 /users/changePwd`
<pre>
    // post请求
    data:{
        oldPwd:'旧密码',
        newPwd:'新密码',
        newPwdAgain:'新密码'
    }
</pre>
`5、退出登录 /users/logout`
<pre>
    // post请求
    无需传参
</pre>

`6、修改密码接口 /users/changePwd`
<pre>
    // post请求
    data:{
        oldPwd:'旧密码',
        newPwd:'新密码',
        newPwdAgain:'新密码'
    }
</pre>

`7、留言删除 /users/delMsg`
<pre>
    // post请求
    data:{
        id:'留言 id'
    }
</pre>

`8、留言查询 /users/getMsg`
<pre>
    // post请求
    data:{
        pageIndex:'页码',
        pageSize:'每页条数'
    }
</pre>

`9、根据文章 title 查询留言 /users/getMsgByTitle`
<pre>
    // post请求
    data:{
        pageIndex:'页码',
        pageSize:'每页条数',
        articleTitle:'文章 title'
    }
</pre>

`10、进行留言接口 /users/liveMsg`
<pre>
    // post请求
    data:{
        articleId:'文章 id',
        articleTitle:'文章名称',
        msgCon:'留言内容',
        nickName:'留言人'
    }
</pre>

`11、根据文章 id 查询留言（每篇文章下展示使用） /blog/getMsg`
<pre>
    // post请求
    data:{
        id:'文章id'
    }
</pre>

`12、根据文章 id 查询留言 /blog/getMsg`
<pre>
    // post请求
    data:{
        id:'文章id'
    }
</pre>

`13、发布文章 /users/postArticle`
<pre>
    // post请求
    data:{
        articleTitle:'文章题目',
        articleCon:'文章内容'
    }
</pre>

`14、查询发布后的文章（后台管理） /users/getArticle`
<pre>
    // post请求
    data:{
        pageIndex:'页码',
        pageSize:'条目',
        type:'类型' //2代表全部 1代表展示，0代表不展示
    }
</pre>


`15、根据显示状态和文章题目查询文章 /users/queryArticleByTitleAndStatus`
<pre>
    // post请求
    data:{
        articleTitle:'文章题目',
        pageIndex:'页码',
        pageSize:'条目',
        type:'类型' //2代表全部 1代表展示，0代表不展示
    }
</pre>

`16、根据显示状态和文章题目查询文章 /users/queryArticleByTitleAndStatus`
<pre>
    // post请求
    data:{
        articleTitle:'文章题目',
        pageIndex:'页码',
        pageSize:'条目',
        type:'类型' //2代表全部 1代表展示，0代表不展示
    }
</pre>

`17、修改文章显示状态 /users/changeArticleStatus`
<pre>
    // post请求
    data:{
        id:'文章 id',
        status:'类型' //1代表展示，0代表不展示
    }
</pre>

`18、删除文章 /users/deleteArticle`
<pre>
    // post请求
    data:{
        id:'文章 id'
    }
</pre>

`19、登录态验证 /users/checkLogin`
<pre>
    // post请求 不传参
    返回 1登录 0未登录
</pre>

`20、微信 openid 获取 /wx/wx_openid`
<pre>
    // post请求
    data:{
        appid:'',
        secret:'',
        code:''微信登陆后的code'
    }
</pre>

`21、微信签名获取 /wx/wx_signature`
<pre>
    // post请求
    data:{
        url:''
    }
</pre>



		

