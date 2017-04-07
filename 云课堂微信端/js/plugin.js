/*
 * @Author: Administrator
 * @Date:   2016-11-14 10:44:15
 * @Last Modified by:   Administrator
 * @Last Modified time: 2017-02-05 16:14:10
 */

'use strict';
//格式化时间
function datefn(time){
    var result = "";

    if(time){
        // 获取日期和时间
        var dateT = time.split("T");
        var dateStr = dateT[0];
        var dayStr = dateT[1];
        var strTd = new Date(Date.parse(dateStr));
        var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
        var day = strTd.getDay();
        var month = strTd.getMonth()+1;
        var date = strTd.getDate();
        var dayTime = dayStr.slice(0, 5);

        result = month + " 月" + date + " 日    " + dayTime +"   " + show_day[day]
    }

    return result;
}

// 获取作业信息
function coursefn(course){
    if(course !== null && course !== undefined){
        return course.slice(0, 1);
    }else{
        return ' ';
    }

}

function homeworkFn(content,images){
    var result = "";
    console.log(images);
    if(content){
        var contStr = content.split("\n");

        for (var i = 0; i < contStr.length; i++) {
            result += contStr[i] + "<br>";
            //var imgUrl = images[i].substr(0,)
            if(images !== undefined && images.length>0 ){
                if(images.length > contStr.length){
                    for(var j = 0;j<images.length;j++){
                        result += '<img src="'+ images[j] +'"/>' + "<br>";
                    }
                }else{
                    result += '<img src="'+ images[i] +'"/>' + "<br>";
                }
            }
        }
    }
    return result;
}

// 设置音频播放地址
var result='';
function audFn(url,a){
    //if(url == undefined || url == null || url.length ==0){
    //     console.log($(a));
    //     // $(this).prev().hide();
    //}
    return result  = url ? url : "";
}

function homeworkAud(length,url){
    var vurl = url.split(".")[1];
    if(vurl === "mp3"){
        console.log(url.length);
    }
    var str = "";
    if(url.length > 0){
        str = "<span class=\"voice-date\"><i></i>" + length +"”</span>" +
        "<audio class=\"noticesAud\" src=\"" + audFn(url) + "\" style=\"display:none;\">\n    </audio>";
    }else{
        str = "<span class=\"voice-date\"><i></i>没有语音</span>"
    }
    return str;
}
