/**
 * Created by Administrator on 2018/6/26.
 */
$(function(){
  //1-根据接口文件发送ajax给后台,获取数据根据渲染引擎渲染数据
  var currentPage = 1;
  var pageSize = 5;

  render()
  function render(){
    $.ajax({
      type:'get',
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        //console.log(info);
        $('tbody').html(template('tmp',info));

        //2-渲染分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          totalPages:Math.ceil(info.total/info.size),
          currentPage:info.page,
          onPageClicked:function(a,b,c,page){
            //跟新当前页
            currentPage = page;
            //渲染当前页
            render();
          }
        })
      }
    })
  }

  //3-点击添加分类按钮,显示模态框
  $('.addbtn').on('click',function(){
    $('#addModal').modal('show');

    //发送ajax请求获取分类数据动态渲染在下拉框
    $.ajax({
      url:"/category/queryTopCategoryPaging",
      type:"get",
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        $('#menu').html(template('tmpModal',info));

      }
    })
  })

  //4-给menu添加a的点击事件,事件委托
  $('#menu').on('click','li>a', function(){
    //注意: 子元素的选择器必须在父元素下一级开始,默认从当前父级往下查找这个选择器
    //1-获取a的内容设置给按钮
    $('.btnTxt').text($(this).text());

    //2- 获取a的id 设置给输入框 categoryId
    //要获得id需要先存储,将每个id存储在每个a的自定义属性data-id中
    var id = $(this).data('id')
    $('[name="categoryId"]').val(id);
    //还需要手动设置状态图标
    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
  })

  //5-初始化文件上传,获取上传文件的地址的设置给img的src属性
  $('#fileupload').fileupload({
dataType:'json',
    done:function(e,data){
      console.log(data.result.picAddr);//data是一个对象,对象里有图片的信息
      //将图片的地址设置给img
      $('#img-box img').attr('src',data.result.picAddr);
   //将图片的地址存在name="brandLogo" 的 input 框中
$('[name="brandLogo"]').val(data.result.picAddr)

      //设置图标状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo',"VALID");

    }
  })


  //4-表单初始化校验
  $('#form').bootstrapValidator({
    //清空不校验的类型,使隐藏域也能校验
    excluded: [],

    //设置校验状态图片
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验字段
    fields:{
      //二级分类名
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类名称"
          }
        }
      },
      //一级分类名
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      //二级分类logo
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
  })

  //5-表单校验成功事件,阻止默认提交,使用ajax请求
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      url:"/category/addSecondCategory",
      type:'post',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          //隐藏模态框
            $('#addModal').modal('hide');
          //  重置表单
          $("#form").data('bootstrapValidator').resetForm(true);
          //渲染第一页
          currentPage=1;
          render()

          $('.btnTxt').text("请选择一级分类");
          $('#img-box img').attr('src',"images/none.png");


        }
      }
    })

  })

})