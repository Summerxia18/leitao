$(function(){
    //1-功能1: 进入页面,获取本地存储中的历史记录,转化成数组,遍历根据模板引擎渲染

    //模拟假的历史记录
    var arr1 = ["1", "2", "3", "4"]
    var jsonstr = JSON.stringify(arr1);
    localStorage.setItem('search-list',jsonstr);

    render();

    //获取历史记录数组
    function getHistory(){
        var str = localStorage.getItem('search-list') || '[]';
        var arr = JSON.parse(str);
        return arr;
    }
    //获取历史记录,渲染历史记录
    function render(){
        var arr = getHistory();
       $('.lt-history').html(template('tmp',{arr:arr}))
    }

    //2-清空历史功能
    //2.1-给清空历史添加点击事件
    //2.2-本地存储中的历史记录,清空
    //2.3-重新渲染
    $('.lt-history').on('click','.emptybtn',function(){
        //添加弹出确认框
        mui.confirm("您是否要清空所有的历记录","温馨提示",['取消','确认'],function(e){
            // console.log(e);
            if(e.index===1){
                localStorage.removeItem('search-list');
                render();
            }
        })    
    })
    //3-点击某条历史记录进行删除
    $('.lt-history').on('click','.mui-icon',function(){
        //弹出确认框
        var that = this;
        mui.confirm("您是否要清空所有的历记录","温馨提示",['取消','确认'],function(e){
            // console.log(e);
            if(e.index===1){
              
        var arr = getHistory();
        var index = $(that).data("index")
        arr.splice(index,1);
        localStorage.setItem('search-list',JSON.stringify(arr));
        //重新渲染
        render();



            }
        })    



    })

    //4-点击搜索按钮,将搜索的内容添加到本地存储的历史记录中,重新渲染
    //重复的历史记录,删除旧的保留新的
    //新的历史记录在上面
    //限制历史记录最多显示10条
    //排空
    $('.btnSearch').on('click',function(){
        //获取输入框内容
        var key = $('input').val();
        if(key.length===0){
            //提示框
            mui.toast('请输入搜索关键字',{ duration:'long', type:'div' }) 
            return;
        }
        var arr = getHistory();
        //判断历史记录是否已经存在
        var num = arr.indexOf(key);
        if(num>-1){
            //说明已经存在
            //删除旧的
            arr.splice(num,1);
        }

        if(arr.length>=10){
            arr.pop();
        }

        arr.unshift(key);
        localStorage.setItem('search-list',JSON.stringify(arr))
         render();
        
           // 清空输入框
         $('input').val('');

        // 进行跳转,将关键字拼接在地址后面传递给其他页面
        location.href='searchList.html?key='+key;

     
    })
})