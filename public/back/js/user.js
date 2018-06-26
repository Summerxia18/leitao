/**
 * Created by Administrator on 2018/6/26.
 */

//1-发送ajax请求获取用户数据,利用渲染引擎渲染
$(function(){
  var currentPage = 1;
  var pageSize = 5;

  var currentId;
  var isDelete;
  render();
 function render(){
   $.ajax({
     type:'get',
     url:"/user/queryUser",
     data:{
       page:currentPage,
       pageSize:pageSize
     },
     dataType:'json',
     success:function(info){
       //console.log(info);
       $('tbody').html(template('tmp',info))
       //2-分页渲染功能
       $('#pagination').bootstrapPaginator({
         bootstrapMajorVersion:3,
         currentPage:info.page,//当前页
         totalPages:Math.ceil(info.total/ info.size),//总页数
         onPageClicked:function(a, b, c, page){
           //为按钮绑定点击事件 page:当前点击的按钮值
         //更新当前页
         currentPage=page;
           //渲染当前页
           render();
         }
       })
     }
   })
 }
//2-给禁用和启用按钮利用事件委托注册点击事件
  $('tbody').on('click','.btn',function(){
    //1-弹出模态框,先让模态框显示
    $('#myModal').modal('show');
    //2-获取当前id更新currentId
    currentId = $(this).parent().data('id');
    //3-根据当前按钮的类名判断isDelete的值
    isDelete= $(this).hasClass('btn-danger')? 0:1;
  })

//3-点击模态框的确认按钮,隐藏模态框,发送请求给后台,修改按钮信息
  $('.btn-confirm').on('click',function(){
    //1隐藏模态框
    $('#myModal').modal('hide');
    //2-获取用户id和isDelete信息发送ajax请求给后台(查看接口)
    $.ajax({
      type:"post",
      data:{
        id:currentId,
        isDelete:isDelete
      },
      url:"/user/updateUser",
      dataType:'json',
      success:function(info){
        //console.log(info);
        if(info.success){
          //重新渲染当前页 -- 这个时候currentPage 就是当前页,没有变化,直接render()就可以了
          render();
        }
      }
    })

  })


})


