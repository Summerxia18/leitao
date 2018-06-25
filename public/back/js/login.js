/**
 * Created by Administrator on 2018/6/25.
 */

//1-进行表单校验配置
$(function(){
  //表单检验初始化
  //校验要求:
  //  *        (1) 用户名不能为空, 长度为2-6位
  //*        (2) 密码不能为空, 长度为6-12位
  $('#form').bootstrapValidator({

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',//校验成功 -字体图标
      invalid: 'glyphicon glyphicon-remove',//校验失败
      validating: 'glyphicon glyphicon-refresh'//校验中
    },


    //指定校验字段
    fields:{
      username:{
        validators:{
        //  不能为空
          notEmpty:{
            message: '用户名不能为空'
          },
        // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        validators:{
          //  不能为空
          notEmpty:{
            message: '密码不能为空'
          },
          // 长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          callback:{
            message:'密码错误'
          }
        }
      }
    }
  })
})

//2-注册表单校验成功事件,在成功事件内,阻止默认的表单提交,通过ajax进行提交
$(function(){

  $('#form').on('success.form.bv',function(e){
  //阻止默认提交表单
  e.preventDefault();
  //通过ajax提交请求
  $.ajax({
    type:'post',
    data:$('#form').serialize(),
    url:"/employee/employeeLogin",
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.success){
        location.href="index.html";
      }
      if(info.error===1000){
        //用户名不存在
        //alert(info.message);
        $('#form').data("bootstrapValidator").updateStatus('username','INVALID','callback')
      }
      if(info.error===1001){
      //  密码错误
      //  alert(info.message);
        $('#form').data('bootstrapValidator').updateStatus('password',"INVALID","callback")
      }
    }

  })
})
})

//3-点击重置按钮, 充值校验状态
$(function(){
  $('.btn-reset').on('click',function(){
    $("#form").data('bootstrapValidator').resetForm();
  })
})

