/**
 * Created by admin on 2016/7/28.
 */

$(function(){
    /*
     * 获取班级
     * */
    function getClassRoom(data){
        alert("获取到的参数："+data);
        $.ajax({
            type:"get",
            url:"../users/"+ajaxPara+"/classrooms",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (data) {
                console.log(data);
               $(".class-txt").html(data.class-txt);
            },
            error:function(a){
               alert("das");
            }
        })
    }
})

