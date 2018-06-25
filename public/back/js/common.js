/**
 * Created by Administrator on 2018/6/25.
 */
//用户拦截放在最上面
//5-用户登录拦截,除了登录页面不需要做登录拦截
if(location.href.indexOf('login.html')===-1){
  //值是-1的时候不是登录页
  //登录拦截:确认用户是否登录过--需要发送ajax请求给后台询问
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    dataType:'json',
    success:function(info){
      if(info.error===400){
        //未登录过,跳转登录页
        location.href="login.html";
      }
    }
  })
}



//1-添加公共进度条功能,给ajax请求添加
//发送ajax请求,开启进度条; ajax请求结束,关闭进度条
$(document).ajaxStart(function(){
  NProgress.start();
})

$(document).ajaxStop(function(){
  //模拟网络延迟
  setTimeout(function(){
    NProgress.done();
  },500);
});

$(function(){
  //添加公共功能
//1-添加点击分类管理 二级菜单显示隐藏
  $('.lt-aside .category').on('click',function(){
    $('.lt-aside .child').stop().slideToggle();
  })
//2-点击菜单图标,侧边栏显示隐藏
  $('.lt-main .btn-menu').on('click',function(){
    $('.lt-aside').toggleClass('hideAside');
    $('.top-bar').toggleClass('hideAside');
    $('.lt-main').toggleClass('hideAside');
  })
//3-点击退出按钮, 弹出模态框
  $('.lt-main .btn-logout').on('click',function(){
    $('#myModal').modal('show');
  })
//4-点击退出按钮,发送ajax请求给销毁用户信息,跳到登录页
  $('#myModal .btn-back').on('click',function(){
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    })
  })
})

