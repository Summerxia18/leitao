$(function(){
    //1-获取地址栏传输过来的数据,设置给input框,通过ajax发送请求获取相关数据
    //根据模板引擎进行渲染
    //一进页面进行页面解析
    var key = getSearch('key');
    $('input').val(key);
    render();

    function render(){
        var params = {};
        params. proName=$('input').val();
        params.page=1;
        params.pageSize=100;
        $current= $('.lt-sort .current');
        if($current.length>0){
            //说明有高亮的需要进行排序
            //判断是按什么进行排序
            //将判断排序的参数存储在自定义参数中, 然后根据高亮的元素中的自定义属性确认按什么进行排序
            //升序还是降序由i标签的箭头方向决定
            var sortName = $('.current').data('type');
            var sortValue = $('.current').find('i').hasClass('fa-angle-down')?2:1;
            params[sortName]=sortValue;
        }
        // console.log(params);
        
        


        $.ajax({
            type:'get',
            url:'/product/queryProduct',
            data:params,
            dataType:'json',
            success:function(info){
                // console.log(info);
                $('.lt-products').html(template('tmp',info))
            }
        })
    }

    //2-点击搜索按钮,获取input的值,发送ajax给后台请求数据,进行模版渲染
    //搜索成功后需要将搜索记录添加到本地存储的历史记录中
    $('.btnSearch').on('click',function(){
        var val = $('input').val();
        if(val===""){
            mui.toast('请输入搜索关键字');
            return;
        }
        render();

        //将搜索的关键字添加到本地的历史记录中
        //获取本地历史记录
        var search = localStorage.getItem('search-list')|| "[]";
        var arr = JSON.parse(search);
        var index = arr.indexOf(val);
        if(index>-1){
            //删除旧项添加新项
            arr.splice(index,1);
        }

        if(arr.length>=10){
            arr.pop();
        }
        //将关键字添加到记录里面
        arr.unshift(val);
        //转换成字符串,存储到本地存储里面
        localStorage.setItem('search-list',JSON.stringify(arr));

        //清空input框
        $('input').val("");


    })
    //3-排序功能添加
    //添加点击事件
    //如果没有current需要加上current,并且其他a移除current,
    //如果有current切换小箭头即可
    //页面重新渲染
    $('.lt-sort a[data-type]').click(function(){
        if($(this).hasClass('current')){
            $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up')
        }else{
            $(this).addClass('current').parent().siblings().find('a').removeClass('current');
        }

        render();

    })
    

})