$(function(){
    //1-一进入页面请求购物车接口,获取购物车数据,根据模板进行渲染
    // render();
    function render(){

       setTimeout(function(){
        $.ajax({
            type:"GET",
            url:"/cart/queryCart",
            dataType:'json',
            success:function(info){
                console.log(info);
                var htmlStr = template('proTmp',{list:info})
                $('.mui-table-view').html(htmlStr);
                //关闭下拉刷新
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                
            }
        })
       },500)
    }

    //2-添加下拉更新功能
    mui.init({
        pullRefresh : {
          container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            callback :function(){
                render();
             }
            }
        }
    });

    //3-删除功能
$('.mui-table-view').on('tap','.btn_delete',function(){
   var id =  $(this).data('id');
   $.ajax({
       type:"GET",
       url:"/cart/deleteCart",
       data:{
           id:[id]
       },
       dataType:'json',
       success:function(info){
         console.log(info);
         if(info.success){
             //删除成功,重新渲染,这边是重新启用下拉刷新
             mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()

         }
       }
   })
})

//4-编辑功能
//点击编辑按钮,弹出一个确认框
//根据之前请求回来的数据渲染确认框
$('.mui-table-view').on('tap','.btn_edit',function(){

    var dataObj = this.dataset;
    console.log(dataObj);

    var htmlStr= template('tmp',dataObj);
    //需要将凭借后的字符串中的\n取掉,否则会被mui解析成换行
    htmlStr = htmlStr.replace(/\n/g,"");

    mui.confirm(htmlStr,'编辑商品',['确认','取消'],function(e){

        if(e.index===0){
            var size = $('.size-box span.current').text();
            var num = $('.num-box input').val();
            var id = dataObj.id;
            $.ajax({
                type:'POST',
                data:{
                    id:id,
                    size:size,
                    num:num
                },
                url:"/cart/updateCart",
                dataType:'json',
                success:function(info){
                    console.log(info);
                    if(info.success){
                        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                    }
                }
            })
        }
    })


    //5-数量输入框初始化
    mui('.mui-numbox').numbox();
    //6-给span添加可选中事件
    $('.size-box span').click(function(){
        $(this).addClass('current').siblings().removeClass('current');
    })

})

//7-计价功能
//采用事件委托给多选框注册点击事件
$('.mui-table-view').on('click','.ck',function(){
    // alert(1)
    //获取所有被选中的元素
    var sum =0;
    var all = $('.ck:checked');
    all.each(function(index,ele){
        var price = $(ele).data('price');
        var num = $(ele).data('num');
        sum += price * num;
    })
    sum = sum.toFixed(2);
    // console.log(sum);
    $('.totalSum').text(sum);
})






})