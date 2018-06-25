/**
 * Created by Administrator on 2018/6/25.
 */

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
