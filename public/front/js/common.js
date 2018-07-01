$(function(){
    //1-区域滚动初始化
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false,
    });
    //2-轮播图功能
    //复制结构按要求添加类名即可,mui自动初始化了,不需要手动初始化
    //添加小圆点
    //设置轮播图自动播放
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
    });
})


// 封装了一个获取解析地址的方法

function getSearch(attr){
    var search = location.search;//"?key=2&age=18"
    search = decodeURI(search);
    search = search.slice(1);
    var arr = search.split('&');// ["key=2", "name=zs"]
    var obj = {};
    arr.forEach(function(v,i){
        var key = v.split('=')[0];
        var value=v.split('=')[1];
        obj[key]=value;
    })
    
     return obj[attr];

}