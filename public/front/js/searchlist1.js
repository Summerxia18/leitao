$(function(){
    //一进入页面,下拉刷新加载
    $('.search-btn').val(getSearch('key'));
    var currentPage=1;
    var pageSize = 2;

//封装发送ajax请求获取数据的方法,渲染数据的方法通过参数在函数调用的时候传递进来
  //下拉刷新和上拉加载的渲染方法不一样
function render(callback){
        //1-处理接口参数
        var params = {};
        params['proName']= $('.search-btn').val();
        params['page']=currentPage;
        params['pageSize']=pageSize;
        //处理两个可选参数,先看有没有高亮,没有高亮就不用排序,有高亮需要排序,按什么排序
        //看属性选择器的值,升序还是降序看小图标箭头方向
        var $current = $('.lt-sort .current');
        if($current.length>0){
            //需要排序,获取排序的键和值
            var sortKey = $current.data('type');
            var sortValue = $current.find('i').hasClass('fa-angle-down')?2:1;
            params[sortKey] = sortValue;
        }
        
       
        //模拟网络延迟
        setTimeout(function(){
            $.ajax({
                type:"get",
                url:'/product/queryProduct',
                data:params,
                dataType:'json',
                success:function(info){
                    console.log(info);
                    // 将渲染数据的方式通过函数传进来
                    callback && callback(info);
                }
            })
        },500)
    }



mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识
      //2-下拉刷新初始化
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function(){
            currentPage=1;
            //下拉刷新,发送ajax请求,获取数据进行渲染
            render(function(info){
                var htmlstr = template('tmp',info)
                $('.lt-products').html(htmlstr);
            })

            //需要手动关闭下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            // console.log( mui('.mui-scroll-wrapper').pullRefresh() );
            //下拉刷新完成后重新渲染了第一页,需要重新允许上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();;
        }
      },
      //上拉加载初始化
      up : {
        callback :function(){
            //根据页面发送ajax请求数据进行渲染
            currentPage++;
            render(function(info){
                if(info.data.length===0){
                    //结束上拉加载
                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                }else{
                    var htmlStr = template('tmp',info);
                    $('.lt-products').append(htmlStr);
                     //结束上拉加载
                     mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                }

            })
        }
    }
    }
})
    




//3-点击搜索按钮重新获取重新触发下拉刷新
$('.btnSearch').click(function(){
    var key = $('.search-btn').val();
    if(key ==""){
        mui.toast('请输入搜索关键字');
        return;
    }
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

    //存储搜索信息到本地存储
    var str = localStorage.getItem('search-list') || [];
    var arr = JSON.parse(str);
    var index = arr.indexOf(key);
   if(index>-1){
       arr.splice(index,1);
   }

   if(arr.length>=10){
       arr.pop();
   }
    arr.unshift(key);

    //重新存储到本地存储中去
    localStorage.setItem('search-list',JSON.stringify(arr));

    //清空搜索框
    $('.search-btn').val('');

    
})

//4-添加排序功能
//在mui中,下拉刷新中的a点不了,跳转不了
//考虑使用事件委托,添加点击事件,由于click有300ms的延迟,使用tap事件
$('.lt-sort a[data-type]').on('tap',function(){
    //1-判断有没有current,没有添加current,移出其他的current
    //2-如果有current,修改箭头方向
    if($(this).hasClass('current')){
        $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    }else{
        $(this).addClass('current').parent().siblings().find('a').removeClass('current')
    }
    //重新调用下拉刷新功能
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
})

//5-给商品a标签注册tap事件,跳转商品详情页,并且获取商品id随着地址一起传递给新页面
$('.lt-products').on('tap','a',function(){
    var productId = $(this).data('id');
    location.href="product.html?productId="+ productId;
});



})
