$(function(){
    // 1-一进入页面利用ajax发送请求,获取数据根据模板引擎 渲染数据
    var currentPage=1;
    var pageSize = 2;
    var picArr=[];//设置一个数组用来存放上传图像获后返回的图片信息对象

    render();

    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:'json',
            success:function(info){
                // console.log(info);
                $('tbody').html(template('tmp',info));
                //2-分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    totalPages:Math.ceil(info.total/info.size),
                    currentPage:info.page,
                    // 配置每个按钮的显示文字
                    //每个按钮在初始化时都会调用这个函数,根据返回值设置按钮的文字
                    itemTexts:function(type,page,current){
                        // console.log(type,page,current);
                        switch(type){
                            case "first":
                            return "首页";
                            case "prev":
                            return "上一页";
                            case "next":
                            return "下一页";
                            case "last":
                            return "尾页";
                            case "page":
                            return page;
                        }
                    },
                    // 设置鼠标放在按钮上时显示的文字
                    tooltipTitles:function(type,page,current){
                        // console.log(arguments);
                        switch(type){
                            case "first":
                            return "首页";
                            case "prev":
                            return "上一页";
                            case "next":
                            return "下一页";
                            case "last":
                            return "尾页";
                            case "page":
                            return "前往第"+page+"页";
                        }
                    },
                    // 设置悬停提示的样式
                    useBootstrapTooltip:true,
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
            }
        
        })
    }

    //3-点击添加商品,弹出模态框
    //点击添加的按钮时,发送ajax请求给后台获取二级分类数据,动太
    //渲染在下拉菜单中
    $('.addBtn').on('click',function(){
        //1-显示模态框
        $('#myModal').modal('show');
        //2-发送ajax请求获取二级菜单数据
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:'json',
            success:function(info){
                // console.log(info);
                $('.dropdown-menu').html(template('showTmp',info))
            }
        })
    })

    //4-点击下拉菜单的a将a的值设置给类名为category的span
    //并获取a的id设置给brandId的输入框--事件委托
    $('.dropdown-menu').on('click','a',function(){
        $('.category').text($(this).text());
        $('[name="brandId"]').val($(this).data("id"));
        $('#form').data('bootstrapValidator').updateStatus('brandId',"VALID")
    })

    //5-文件上传处理-插件,图片预览
    $('#fileuploaded').fileupload({
        dataType:'json',
        done:function(e,data){
            //存储返回的图片数据对象
            picArr.unshift(data.result);
            // console.log(picArr);
            //图片预览,动态创建图片标签,注意先后上传的在前面
            var picSrc = data.result.picAddr
            $('#imgBox').prepend('<img src="'+picSrc+'" width=100 height=100>')
            
            if(picArr.length>3){
                //删除数组最后一个
                picArr.pop();
                //移除最后一个图片
               // img:last-of-type 找到最后一个 img 类型的标签, 让他自杀
                $('#imgBox img:last-of-type').remove();
            }

            if(picArr.length===3){
                //说明上传了3张图片
                //手动修改隐藏域的状态图标
                $('#form').data('bootstrapValidator').updateStatus('picStatus',"VALID")
            }
            
            
        }
    })

    //6-表单校验
    $('#form').bootstrapValidator({
        //1-设置校验隐藏域
        excluded:[],
        //2-设置状态图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //3-设置校验字段
        fields:{
            proName:{
                validators:{
                    notEmpty:{
                        message:"请输入商品名称"
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"请输入商品价格"
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:"请输入商品描述"
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:"请输入商品尺码"
                    },
                    
                // 商品尺码必须是 xx-xx 的格式, 例如 32-40
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:"商品尺码必须是 xx-xx 的格式, 例如 32-40"
                    }
                }
            },
            // statu:{},
            num:{
                validators:{
                    notEmpty:{
                        message:"请输入商品库存"
                    },
                    // 商品库存格式, 必须是非零开头的数字
                   regexp:{
                       regexp:/^[1-9]*$/,
                       message:'商品库存格式, 必须是非零开头的数字'
                   }
                }
            },
            brandId:{
                validators:{
                    notEmpty:{
                        message:"请选择二级分类"
                    }
                }
            },
            picStatus:{
                validators:{
                    notEmpty:{
                        message:"请上传 3 张图片"
                    }
                }
            }
        }
    })
   
    //7-校验成功事件,阻止默认提交,利用ajax发送请求
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        var formData = $('#form').serialize();
        //还需要拼接是上图片的信息
        formData += 'picName1="'+picArr[0].picName+'"&picAddr1="'+picArr[0].picAddr+'"' 
        formData += 'picName2="'+picArr[1].picName+'"&picAddr2="'+picArr[1].picAddr+'"'
        formData += 'picName3="'+picArr[2].picName+'"&picAddr3="'+picArr[2].picAddr+'"'

        $.ajax({
            type:"POST",
            url:"/product/addProduct",
            dataType:'json',
            data:formData,
            success:function(info){
                // console.log(info);
                if(info.success){
                    //关闭模态框
                    $('#myModal').modal('hide')
                    //重新渲染第一页
                    currentPage=1;
                    render();
                    //重置表单
                    $('#form').data('bootstrapValidator').resetForm(true);
                    //按钮内容和图片不能重置,需要手动还原
                    $('.category').text('请选择二级分类');
                    $('#imgBox img').remove();
                }
            }
        })
    })
})