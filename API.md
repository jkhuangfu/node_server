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




		

