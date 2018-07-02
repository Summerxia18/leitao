$(function(){
   //1-一进入页面解析地址,获取传递过来的产品id 
   var productId = getSearch('productId');
// 发送ajax请求
$.ajax({
    type:"GET",
    url:"/product/queryProductDetail",
    data:{
        id:productId
    },
    dataType:'json',
    success:function(info){
        console.log(info);
        var htmlStr = template('proTmp',info);
        $('.lt-center .mui-scroll').html(htmlStr);
        //初始化轮播图, 动态生成的轮播图需要手动初始化
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
            });

        //初始化数组框
        mui('.mui-numbox').numbox();
        }
    })

    //2-添加用户选择尺码功能
    $('.lt-center .mui-scroll').on('click',".size-box span",function(){
        $(this).addClass('current').siblings().removeClass('current');

    })

    //3-加入购物车功能
    //获取产品id , 鞋码数量, 点击加入购物车按钮,发送ajax给后台
    $('#goCart').click(function(){
        var size= $('.size-box span.current').text();
        var num = $('.num-box input').val();
        if(!size){
            mui.toast('请选择尺码');
            return;
        }

        $.ajax({
            type:"POST",
            url:"/cart/updateCart",
            data:{
                id:productId,
                size:size,
                num :num
            },
            dataType:'json',
            success:function(info){
                console.log(info);
                if(info.success){
                    //说明用户是登录状态
                   //弹出确认框
                   mui.confirm('添加成功','温馨提示',['去购物车','继续浏览'],function(e){
                       if(e.index==0){
                           //跳转到购物车页面
                           location.href="cart.html";
                       }
                   })
                }else if(info.error===400){
                    //用户未登录需要跳转到登录页让用户登录
                    //用户登录后需要重新跳至之前的商品页,所以需要将当前商品页
                    //拼接在跳转的登录页后面传递给登录页
                    location.href="login.html?retUrl="+location.href;

            }
            }
        })
    })
})