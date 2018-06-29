$(function(){
    //1-一进入页面,请求一级分类数据,渲染在左边导航栏
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function(info){
            // console.log(info);
            $('#category').html(template('catetmp', info));
            //第一个默认选中,一上来就需要发送id获取二级分来渲染
            renderSecondById(info.rows[0].id);
        }

    })

     //2-点击一级导航,获取当前a的id传递给后台发送ajax请求,获取数据渲染在右边
    $('#category').on('click','a',function(){
        var id = $(this).data('id');
        renderSecondById(id);
        // 点击哪个哪个高亮,具有类名current,其他没有
        $(this).addClass('current')
        .parent().siblings().find('a').removeClass('current');
      
    })

// 封装根据id获取数据渲染的方法
    function renderSecondById(id){
        // console.log(id);
        $.ajax({
            type:"get",
            url:"/category/querySecondCategory",
            data:{id:id},
            dataType:'json',
            success:function(info){
                console.log(info);
                $('.brandlist').html(template('tmp',info))
            }
        })
    }
})