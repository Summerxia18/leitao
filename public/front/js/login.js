$(function(){

    //点击登录按钮
    //1-获取用户名和密码,进行简单的非空校验
    $('.login').click(function(){
        $username= $('input[name="username"]').val();
        $password= $('input[name="password"]').val();
        if(!$username){
            mui.toast('请输入用户名');
            //别忘了终止
            return;
        }
        if(!$password){
            mui.toast('请输入密码');
            return;
        }

        //获取表单数据,发送ajax请求,校验用户信息
        $.ajax({
            type:'post',
            url:"/user/login",
            data:{
                username:$username,
                password:$password
            },
            dataType:'json',
            success:function(info){
                console.log(info);
                if(info.success){
                    //登录成功
                    //1-如果地址栏有地址穿过来,则跳回商品页
                    //2-如果地址按没有地址传过来,则跳转到会员中心
                    var index = location.search.indexOf('retUrl');
                    if(index>-1){
                        var retUrl = location.search.replace("?retUrl=","");//或者使用replace
                        location.href = retUrl;
                    }else{
                        location.href="user.html";
                    }
                    

                }else if(info.error===403) {
                    //登录失败,提醒用户
                    mui.toast('用户名或密码错误');
                    return;
                }
                
            }
        })


    })
   

})