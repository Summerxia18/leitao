/**
 * Created by Administrator on 2018/6/25.
 */

//进行表单校验配置
$(function(){
  //表单检验初始化
  //校验要求:
  //  *        (1) 用户名不能为空, 长度为2-6位
  //*        (2) 密码不能为空, 长度为6-12位
  $('#form').bootstrapValidator({
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
          }
        }
      }
    }
  })
})
