/**
 * Created by huangjin on 2016/6/2.
 */
svrConfig ={
    ip:"localhost",
    port:"8081"
}
$(function(){
    function per_data(){

    }
});
//导航条效果
//var  topHight=$(".header").offset().top;        // 这是导航相对于文档的高度
//window.onscroll = function(){
//    alert(1);
//    if($(document).scrollTop()>topHight){         //当滚动条据上边的高度高于这个导航相对于文档的高度。就要让他固定啦
//        if('undefiend'==typeof(document.body.style.maxHeight)){    //因为//检测是否为IE6。jQuery1.9中去掉了msie的方                                                                                                        法，所以只好这样写
//            var scrollTop=$(document).scrollTop();
//            $(".header").css({'position':'absolute','top':scrollTop+'px'});   //设置导航为相对定位，相对于具有position属性的父类窗口这里就是浏览器。导航距离浏览器的高度为滚动条的高度
//        }
//        else{
//            $(".header").addClass("nav_fixed");  //如果不是IE6就直接可以用position:fixed....nav_fixed里面写的那样就可以啦。
//        }
//    }
//    else     {
//        if('undefiend'==typeof(document.body.style.maxHeight)){
//            var scrollTop=$(document).scrollTop();
//            $(".header").css({'position':'absolute','top':topHeight+'px'});
//        }
//        else{
//            $(".header").removeClass("nav_fixed");
//        }
//    }
//};

window.onscroll = function(){
    var ht=document.documentElement.scrollTop || document.body.scrollTop;
    if(ht>0){$(".header").css({"position":"fixed","top":"0px","margin":"auto","z-index": "1000"});}
    else{$(".header").css({"position":"static"});}
};
