$(function(){
    //1-进入页面发送ajax请求,获取用户消息
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:'json',
        success:function(info){
            //1-用户没有登录过,去登陆页
            if(info.error===400){
            location.href = "login.html";
            return;

            }
            // console.log(info);
            $('#userInfo').html(template('tmp',info))
      
        }
    })
  //2-点击退出按钮,发送ajax请求,销毁用户登录信息 
  $('#logOut').click(function(){
    $.ajax({
        type:'get',
        url:'/user/logout',
        dataType:'json',
        success:function(info){
            // console.log(info);
            if(info.success){
                location.href="login.html";
            }
            
        }
    })
})

})