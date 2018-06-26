/**
 * Created by Administrator on 2018/6/26.
 */
//1-一进入页面,ajax请求数据,按照模版引擎渲染页面

$(function(){
  //1-根据接口文件,设置参数变量
  var currentPage=1;
  var pageSize = 2;

  render();
  //2-渲染方法多次使用,封装一个方法
  function render (){
    $.ajax({
      type:'get',
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        //console.log(info);
        $('tbody').html(template('tmp',info))

        //3-实现分页功能
    $('#paginator').bootstrapPaginator({
      bootstrapMajorVersion:3,
      totalPages:Math.ceil(info.total/info.size),
      currentPage:info.page,
      onPageClicked:function(a,b,c,page){
        //更新当前页
        currentPage=page;
        //渲染当前页
        render();
      }
    })
      }

    })
  }

//3-点击添加分类,弹出模态框
  $('.btn-add').on('click',function(){
    $('#addModal').modal('show');
  })

  //4-表单校验,初始化表单校验
  $('#add-form').bootstrapValidator({
    //1-设置校验状态图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //2-设置校验字段
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"一级分类名称不能为空"
          }
        }

      }
    }
  })

  //2-注册表单校验成功事件, 阻止默认提交,使用ajax请求后台
  $('#add-form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$('#add-form').serialize(),
      dataType:'json',
      success:function(info){
        //console.log(info);
        if(info.success){
          //1-隐藏模态框
            $('#addModal').modal('hide');
          //2-渲染第一页
          currentPage=1;
          render()
        //3-重置表单 表单实例调用方法
          $('#add-form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })




})