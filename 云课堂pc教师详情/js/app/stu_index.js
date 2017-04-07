var userId; //用户Id
var session;    //页面授权
var userName = ""; //用户姓名
// 防止用户评论刷屏
var functionTime;



var str = window.location.search;
if (str.indexOf("id") != -1) {
    userId = str.split('id=')[1].split('&')[0];
    console.log(userId);
}
if (str.indexOf("session") != -1) {
    session = str.split("session=")[1].split('&')[0];
}
$(function () {
    $(window).scrollTop(0);
    //上传课件功能
    // 表单数据对象
    var form={

    };
    // 列表对象
    var  ul_grid = $("ul.list-unstyled");

    // 文件选择框
    var file = $("#inputfile");
    // 文件选择div
    var file_lab = $("#file");
    // 科目
    var project = $("#project");

    // 单选框checkbox
    var checkbox = $("#type input");
    console.log(checkbox);
    // 网址输入栏div
    var url = $("#Url");
    console.log(url);
    // 网址输入input
    var url_input = url.find("input");

    // 附件描述
    var desc = $("#description");
    // 附件描述父类div
    var desc_div =  desc.parent();
    // 添加列表识别id
    var num = 1;

    // // 默认是上传文档
    url.hide();
    // 所有作业数据
    var homework_g = [];
    var n = 0;
    $(window).scroll(function(){
        console.log(n);
        //下面这句主要是获取网页的总高度，主要是考虑兼容性所以把Ie支持的documentElement也写了，这个方法至少支持IE8
        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;
        // console.log(htmlHeight);
        //clientHeight是网页在浏览器中的可视高度，
        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;
        // console.log(clientHeight);
        //scrollTop是浏览器滚动条的top位置，
        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
        // console.log(scrollTop);
        //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
        if(scrollTop+clientHeight >=(htmlHeight+300)){
            if(n < 7){

                n++;
                if(homework_g.length>0){
                    if(homework_g[n] !== undefined && homework_g[n] !==false){
                        var data = homework_g[n];
                        homework_g[n] = false;
                        renderHomDom(data);
                    }
                    console.log(n);
                }else{
                    $(window).scrollTop(0);
                }

                // $("ul.homework").append('<li>'+num+'</li>');
            }else{
                n = 0;
                // window.location.reload();
            }
        }
    })
    // 滚动加载页面
    function renderHomDom(data){
        console.log(2);
        console.log(data);
        for (var j = 0; j < data.data.length; j++) {
            //获取作业评论

            // getComment(data.data[i].id);
            var comments = data.data[j].comment?data.data[j].comment:'';
            console.log(comments);
            var homework = ("\n<li>\n    <div class=\"message\">\n        <p class=\"teacher\"><span class=\"yu\">" + coursefn(data.data[j].course) + "</span><span class=\"jiang\">" + data.data[j].publisher.name + "老师布置了作业</span><span class=\"date\">" + datefn(data.data[j].publish_at) + "</span></p>\n        <div class=\"work-in\">\n            <p class=\"start firsts\">\n            <span class=\"classify neirong\">作业内容</span><span class=\"definite\">" + homeworkFn(data.data[j].content) + "</span><div class=\"clear\"></div></p>\n            <p><span class=\"classify voice\">语音</span>" + homeworkAud(data.data[j].record_length,data.data[j].record_url) + "</p>\n            <p class=\"end lasts\"><span class=\"classify\">截止时间</span><span class=\"end-date\">" + datefn(data.data[j].deadline) + "</span></p>\n        </div>\n            <p class=\"comment\">共1049条评论</p>\n        <div class=\"comment-in\">\n            <input type=\"text\" placeholder=\"说两句吧\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"bottom\"data-content=\"评论间隔不得小于5秒\"/>\n            <span class=\"button sendMess " +data.data[j].id +"\">发送</span><div sytle=\"clear:both;\"></div>");
            if(comments.length > 0){
                homework +="<ul class=\"comments\">";
                for (var a = 0; a < comments.length; a++) {
                    homework +=
                        "<li><p><span class=\"name\">"+comments[a].user_name+"：</span><span>"+comments[a].content+"</span></p></li>";
                }
                homework +="</ul>";
                homework += "<p class=\"check-more "+data.data[j].id+"\">查看更多</p>\n        </div>\n    </div>\n</li>\n";
            }else{
                homework += "<ul class=\"comments\"></ul>"
            }

            $("ul.homework").append(homework);
        }
        $(".voice-date").on("click",function(e){
            voiDate(this);
            // $(this).next().play();
        });
        // 发送讯息事件
        $(".button.sendMess").on('click', function(event) {
            // alert("sendMessage");

            writeClientMessage(this,userName);
            event.preventDefault();
            /* Act on the event */
        });
        // 查看更多评论
        $("p.check-more").bind('click', function(event) {
            var homework_id = $(this).attr('class').split(" ")[1];
            console.log(homework_id);
            // 查看当前作业所有品论
            getComment_more(homework_id,this);
            event.preventDefault();
            /* Act on the event */
        });


    }

    if (userId  && session) {
        function addHW(num){
            getHomework(null,userId,session,num);
        }
        getHomework(null,userId,session);
        // 获取用户姓名
        $.ajax({
            type: "GET",
            url:  "../users/" + userId,
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("X-Session", session);
            },
            dataType:"json",
            success:function(data){
                console.log(data);
                userName = data.data.name;
                console.log(userName);
                $("#nickNamepack").text(userName);
            },
            error: function (data) {
                console.log(data);
            }
        });


        // 获取用户班级信息
        $.ajax({
            type: "GET",
            url:  "../users/" + userId +'/classrooms?embed_members=1',
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("X-Session", session);
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                var teaNumber='';
                var stuNumber='';
                if (data.data.length>0) {
                    console.log(data.data[0]);
                    var classmem=data.data[0].classmembers;
                    console.log(classmem);
                    var classrooms_id_group = [];
                    for (var i = 0; i < data.data.length; i++) {
                        classrooms_id_group.push(data.data[i].id);
                        var myClass = ("\n<li >\n    <div class=\"class-txt\">\n        <p class=\"schools\">" + data.data[i].school.school_name + data.data[i].grade + data.data[i].name + "</p>\n        <p><span>班号："+data.data[i].id +"</span><span class=\"copy\">   复制</span></p>\n       <p>教师：" + classTnfn(data.data[i].classmembers) + "【教号:" + classTfn(data.data[i].classmembers) + "】</p>\n    </div>\n</li>\n");
                        $(".class ul").append(myClass);

                    }
                    var classrooms_ids = classrooms_id_group.join();


                    var stuArr=[];
                    for(var i=0;i<classmem.length;i++){
                        var role=classmem[i].role;
                        console.log(role);

                        //老师数据
                        teaNumber +='<tr>';
                        if(role==1){
                            teaNumber +='<td>'+ classmem[i].name +'</td>';
                            teaNumber +='<td>'+ classmem[i].user_id +'</td>';
                            teaNumber +='<td>'+ classmem[i].course +'</td>';
                        }
                        teaNumber +='</tr>';
                        $("#accountBook tr:gt(0)").remove();
                        $("#accountBook").append(teaNumber);

                        //学生数据
                        if(role==2){
                            stuNumber +='<tr>';
                            stuNumber +='<td>'+ classmem[i].name +'</td>';
                            stuNumber +='<td>'+ classmem[i].user_id +'</td>';
                            stuNumber +='</tr>';
                            $(".studentId tr:gt(0)").remove();
                            $(".studentId").append(stuNumber);
                            stuArr.push(stuNumber);
                            //console.log(stuArr);
                            $(".peopleNum").text(stuArr.length);
                        }
                    }
                }
            }
            //error: function (data) {
            //    // console.log(data);
            //    // window.location.href = "login.html";
            //}
        });
    }


    //隐藏或显示个人信息下拉菜单

    $(".more").click(function () {
        if ($(".more-in").is(":hidden")) {
            $(".more-in").show();    //如果元素为隐藏,则将它显现
            $(this).css("background", "url(images/indexPage/more-down.png) no-repeat right center");
        } else {
            $(".more-in").hide();     //如果元素为显现,则将其隐藏
            $(this).css("background", "url(images/indexPage/more-up.png) no-repeat right center");
        }
    });
    //切换首页显示内容

    $(".more").click(function () {
        if ($(".more-in").is(":hidden")) {
            $(".more-in").show();    //如果元素为隐藏,则将它显现
            $(this).css("background", "url(images/indexPage/more-down.png) no-repeat right center");

        } else {
            $(".more-in").hide();     //如果元素为显现,则将其隐藏
            $(this).css("background", "url(images/indexPage/more-up.png) no-repeat right center");
        }
    });

    //切换首页显示内容

    $(".nav li").click(function () {
        $(".nav li").attr("class", "");
        $(this).attr("class", "current");
        if ($(this).attr("id") == "homework-only") {    //仅显示家庭作业
            $(".all-message").hide();
            $(".message").show();
        }
        else if ($(this).attr("id") == "notice-only") { //仅显示通知
            $(".message").hide();
            $(".all-message").show();
        }
        else {  //显示全部动态
            $(".all-message").show();
            $(".message").show();
        }
    });

// 添加班级相关方法
    function fn(grade) {
        return grade.slice(2)
    }

    // 班主任姓名
    function classTnfn(members){
        var mainTeacher ;
        for (var i = 0; i < members.length; i++) {
            if(members[i].is_head_teacher == 1){
                mainTeacher = members[i].name
            }
        }
        return mainTeacher;
    }
    // 班主任教号
    function classTfn(members){
        var mainTeacherNum ;
        for (var i = 0; i < members.length; i++) {
            if(members[i].is_head_teacher == 1){
                mainTeacherNum = members[i].user_id
            }
        }
        return mainTeacherNum;
    }

    // 获取通知
    function getNotices(classrooms_ids,userId,session){
        var class_id_g = classrooms_ids.split(",");
        for (var i = 0; i < class_id_g.length; i++) {
            var class_id = parseInt(class_id_g[i]);
            console.log(class_id);
            $.ajax({
                type: "GET",
                url:  "../notices" ,
                data:{
                    user_id: userId,
                    classroom_id:class_id,
                    order:"DESC",
                    limit:20
                },
                contentType: "application/json;charset=UTF-8",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Session", session);
                },
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.data.length>0) {
                        var notMessage = $(".all-message");
                        for (var i = 0; i < data.data.length; i++) {
                            var notice = ("\n<div class=\"message-one\">\n    <p class=\"message-alert\"><i></i><span>给" + data.data[i].classroom_info.name + "发送了通知</span></p>\n    <p class=\"the\">" + data.data[i].title + "</p>\n    <p>" + data.data[i].content + "</p>");

                            if(data.data[i].record_length==0){

                            }else{
                                notice +="<p class=\"date\">\n    <i>\n    </i>" + data.data[i].record_length + "\"</p>\n    <audio class=\"noticesAud\" src=\"" + audFn(data.data[i].record_url) + "\" style=\"display:none;\">\n    </audio>";
                            }
                            notice += "<p class=\"publish-data\">"+datefn( data.data[i].publish_at) +"</p>\n</div>\n";

                            notMessage.html(notice);
                        }
                        $("p.date").on("click",function(e){
                            // $(this).next().play();
                            pdate(this);
                        });

                    }
                },
                error: function(data){
                    // alert("error");
                    console.log(data);
                }
            });
        }
    }
    // 获取作业
    function getHomework(classrooms_ids,userId,session,numH){
        // var class_id_g = classrooms_ids.split(",");
        var numH  =  numH?numH:1;
        console.log(numH);
        $.ajax({
            type: "GET",
            url:  "../homeworks_web",
            data:{
                user_id: userId,
                order:"DESC",
                limit:2,
                starting_after:numH
            },
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("X-Session", session);
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                console.log(1);
                homework_g.push(data);
                console.log(homework_g);
                if(data.data.length>0){
                    if(numH == 1){
                        renderHomDom(data);
                    }
                    numH++;
                    getHomework(null,userId,session,numH);
                }else{
                    console.log("已经滚动到底部");
                }

            },
            error: function(data){
                alert("error");
                console.log(data);
            }
        });
    }

    // 播放音频方法
    // function playAudio(){
    //     var aud = $(".noticesAud");
    //     aud.play();
    // }
    // 获得所有评论
    function getComment_more(homework_id,that){
        $.ajax({
            type:"get",
            url:  "../commentList",
            data:{
                "homework_id":homework_id,
                "page":1,
                "pageSize":8
            },
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success:function(data){
                console.log(data);
                var page = data.pagination.pageCount;
                var messUl = $(that).prev();
                $(that).empty();
                $(that).removeClass('check-more');
                $(that).addClass('homework_id');
                $(that).css({
                    textAlign:'center'
                });
                if(page>1){
                    var pageIn = "<ul class=\"pagination\">"+
                        "<li><a>&laquo;</a></li>";
                    for (var j = 0; j < page; j++) {
                        pageIn +=
                            // "<li><a href=\"#\">&laquo;</a></li>"+
                            "<li><a>"+ (j+1) +"</a></li>"
                        // "<li><a href=\"#\">&raquo;</a></li>";
                    }
                    pageIn +="<li><a>&raquo;</a></li></ul>";
                    $(that).append(pageIn);
                    $(that).find('li:eq(1)').addClass('active');
                }
                $(that).unbind('click');
                $(that).find("li").on('click', function(event) {
                    // alert("翻页");
                    var pageli = $(this).text();
                    var right = HTMLDecode('&raquo;');
                    var left = HTMLDecode('&laquo;');
                    var current = $(that).find("li.active");
                    console.log(current);
                    // console.log($(this).text());
                    switch(pageli){
                        case left:
                            var prePage = parseInt(current.text()) - 1;
                            console.log(prePage);
                            if(prePage < 1){
                                alert("已经是第一页");
                                return;
                            }else{
                                $(that).find("li").removeClass('active');
                                current.prev().addClass('active');
                                goToPage(homework_id,prePage,that);

                                return;
                            }
                            console.log(pageli);
                            break;
                        case right:
                            var prePage = parseInt(current.text()) + 1;
                            console.log(prePage);
                            if(prePage > page){
                                console.log("已到最后一页");
                                return;
                            }else{
                                $(that).find("li").removeClass('active');
                                current.next().addClass('active');
                                goToPage(homework_id,prePage,that);
                                return;
                            }
                            break;
                        default:
                            console.log(pageli);
                            $(that).find("li").removeClass('active');
                            var prePage = parseInt(pageli);
                            goToPage(homework_id,prePage,that);
                            $(this).addClass('active');
                            break;
                    }
                    return false;
                    // event.preventDefault();
                    /* Act on the event */
                });
                messUl.empty();
                var li_ajx = '';
                for (var i = 0; i < data.data.length; i++) {
                    li_ajx += "<li><p><span class='name'>"+data.data[i].user_name+":  </span><span>"+ data.data[i].content + "</span></p></li>";
                }
                messUl.append(li_ajx);
            },
            error:function(data){
                console.log(data);
            }
        });
    }
    // 翻页ajax
    function goToPage(homework_id,page,that){
        var messUl = $(that).prev();
        $.ajax({
            type:"get",
            url:  "../commentList",
            data:{
                "homework_id":homework_id,
                "page":page,
                "pageSize":8
            },
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success:function(data){
                console.log(data);
                messUl.empty();
                var li_ajx = '';
                for (var i = 0; i < data.data.length; i++) {
                    li_ajx += "<li><p><span class='name'>"+data.data[i].user_name+":  </span><span>"+ data.data[i].content + "</span></p></li>";
                }
                messUl.append(li_ajx);
            },
            error:function(data){
                console.log(data);
            }
        });
    }
    // 转义html特殊字符方法
    function HTMLDecode(text){
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        // console.log(output);
        return output;
    }

    //刷新评论
    var nm = 0;
    var currData;
    function refresh(messUl,mesJson){
        currData = mesJson;
        $.ajax({
            type:"post",
            url:  "../sendComment",
            data:JSON.stringify(mesJson),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success:function(data){
                console.log(data);
                // 评论恢复 刷新页面
                if(nm <= 1){
                    var  st = setTimeout(function() {
                        messUl.append("<div style='text-align:center'>正在刷新评论请稍候...</div>");

                        $.ajax({
                            type:"post",
                            url:"../sendComment",
                            data:JSON.stringify(currData),
                            contentType: "application/json;charset=UTF-8",
                            dataType: "json",
                            success:function(result){
                                setTimeout(function(){
                                    if(result.data.length > 0){
                                        if(result.data.length > 3){
                                            result.data.length =3;
                                        }

                                        messUl.empty();
                                        var li_ajx = '';
                                        for (var i = 0; i < result.data.length; i++) {
                                            result.data[i]
                                            li_ajx += "<li><p><span class='name'>"+result.data[i].user_name+":  </span><span>"+ result.data[i].content + "</span></p></li>";
                                        }
                                        messUl.append(li_ajx);
                                    }
                                    nm = 0;
                                },500)
                            }
                        })
                    },4500);
                }
            }
        });
    }
    // 发表评论
    function writeClientMessage(that,userName){
        var now = new Date();
        console.log($(that).attr('class'));
        var homework_g = $(that).attr('class').split(" ");
        var homework_id = homework_g[2]?homework_g[2]:'';
        console.log(homework_id);
        var chartM = $(that).prev().val();
        $(that).prev().val('');
        var chartP = $(that).parent();
        // console.log(chartM);
        var messUl = $(that).next().next();
        // console.log(messUl);
        // console.log(functionTime);
        // console.log(now);
        //if(functionTime !== undefined){
        //    var date3 = now.getTime() - functionTime.getTime();
        //    var seconds =date3/1000;
        //    console.log(seconds);
        //    if(seconds >= 5){
        //        functionTime  = now;
        //    }else{
        //        $(that).prev().popover('show');
        //        return;
        //    }
        //}else{
        //    functionTime  = now;
        //}
        var li ="";
        if(chartM.length > 0){
            li = "<li><p><span class='name'>"+userName+":  </span><span>"+ chartM + "</span></p></li>"
        }else{
            return;
        }
        var mesJson = {
            "homework_id":"",
            "user_id":"",
            "content":""
        }
        mesJson["homework_id"] = homework_id;
        mesJson["user_id"] = userId;
        mesJson["content"] = chartM;
        messUl.prepend(li);
        //chartP.find("ul li:gt(2)").remove();
        refresh(messUl,mesJson);
        // 验证完成提交评论信息
        //$.ajax({
        //    type:"post",
        //    url:  "../sendComment",
        //    data:JSON.stringify(mesJson),
        //    contentType: "application/json;charset=UTF-8",
        //    dataType: "json",
        //    success:function(data){
        //        console.log(data);
        //        // 评论恢复 刷新页面
        //
        //        if(data.data.length > 0){
        //            if(data.data.length > 3){
        //                data.data.length =3;
        //            }
        //            console.log(data);
        //            messUl.empty();
        //            var li_ajx = '';
        //            for (var i = 0; i < data.data.length; i++) {
        //                data.data[i]
        //                li_ajx += "<li><p><span class='name'>"+data.data[i].user_name+":  </span><span>"+ data.data[i].content + "</span></p></li>";
        //            }
        //            messUl.append(li_ajx);
        //        }
        //    },
        //    error:function(data){
        //        console.log(data);
        //    }
        //});
        // $(".comment-in ul").;
    }
    function pdate(that){
        alert("aud");
        console.log(that);
        // $(that).next().play();
    }
    // $(".voice-date").on("click",function(e){
    //     voiDate(this);
    //     // $(this).next().play();
    // });
    function voiDate(that){
        alert("voice");
        console.log(that);
    }
});

// 表单提交方法
function submit_form(that,form){
    // 通知
    var jsonObj ={
        "classroom_ids": "",
        "title":"",
        "content":"",
        "record_url":"",
        "record_length":0
    };
    // 作业
    var jsonObjH ={
        "classroom_ids": "string",
        "course": "语文",
        "content": "string",
        "deadline_at": "string",
        "record_url": "string",
        "record_length": 0,
        "images": [

        ]
    };
    console.log(form);
    switch(form){
        case 'notice':
            var noticeForm =$("#Modal_info");
            // 接受通知的班级
            var checked = noticeForm.find("input[type='checkbox']:checked");
            var checkedG = [];
            if(checked.length <=0){
                alert("请选择班级")
                return;
            }
            for (var i = 0; i < checked.length; i++) {
                checkedG.push(checked[i].labels[0].innerText);
            }
            jsonObj["classroom_ids"] = "100418";


            // 通知标题
            var noticeTit = noticeForm.find("input.title[type=text]");
            if(noticeTit.val() == ''){
                alert("标题内容不能为空")
                return;
            }
            jsonObj["title"] = noticeTit.val();

            //通知内容
            var noticeCont = noticeForm.find("textarea.content");
            jsonObj['content'] = noticeCont.val();
            console.log(JSON.stringify(jsonObj));



            $.ajax({
                type:"post",
                url:  "../notices",
                data:JSON.stringify(jsonObj),
                contentType: "application/json;charset=UTF-8",
                beforeSend: function (request) {
                    request.setRequestHeader("X-Session", session);
                },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    noticeForm.modal('hide');
                    if (data.data.length>0) {

                        var notMessage = $(".all-message");
                        for (var i = 0; i < data.data.length; i++) {
                            var notice = ("\n<div class=\"message-one\">\n    <p class=\"message-alert\"><i></i><span>给" + data.data[i].classroom_info.name + "发送了通知</span></p>\n    <p class=\"the\">" + data.data[i].title + "</p>\n    <p>" + data.data[i].content + "</p>");

                            if(data.data[i].record_length==0){

                            }else{
                                notice +="<p class=\"date\">\n    <i>\n    </i>" + data.data[i].record_length + "\"</p>\n    <audio class=\"noticesAud\" src=\"" + audFn(data.data[i].record_url) + "\" style=\"display:none;\">\n    </audio>";
                            }
                            notice += "<p class=\"publish-data\">"+datefn( data.data[i].publish_at) +"</p>\n</div>\n";

                            notMessage.prepend(notice);
                        }
                        $("p.date").on("click",function(e){
                            // $(this).next().play();
                            pdate(this);
                        });

                    }
                },
                error: function(data){
                    alert("error");
                    console.log(data);
                }
            });
            console.log(checked[0].labels[0].innerText);
            break;
        case 'homework':
            var homeForm = $("#myModal");
            var options = {
                type:"POST",//请求方式：get或post
                dataType:"json",//数据返回类型：xml、json、script
                beforeSerialize:function(){
                    //alert("表单数据序列化前执行的操作！");
                    //$("#txt2").val("java");//如：改变元素的值
                },
                //data:{'txt':"JQuery"},//自定义提交的数据
                beforeSubmit:function(){
                    //alert("表单提交前执行的操作！");
                    var imgFil = $("#file2 input[type=file]");
                    console.log(imgFil);
                    // 判断是否为图片格式
                    var format = imgFil.val().split(".")[1];
                    console.log(format);
                    if(imgFil.val() == ""){
                        console.log("不能为空");
                        imgFil.next().text("不能为空!");
                        return false;
                    }

                    if(format !=="jpg" &&format!=="gif"&& format !=="png"){
                        imgFil.next().text('不支持的图片格式');
                        return false;
                    }

                    //if($("#txt1").val()==""){return false;}//如：验证表单数据是否为空
                },
                success:function(json){//表单提交成功回调函数
                    // alert("表单操作完成！操作结果："+json.msg);
                    console.log(json);
                    jsonObjH["images"].push(json.filename);
                    console.log(JSON.stringify(jsonObjH));

                    $.ajax({
                        type:"post",
                        url:  "../homeworks",
                        data:JSON.stringify(jsonObjH),
                        contentType: "application/json;charset=UTF-8",
                        beforeSend: function (request) {
                            request.setRequestHeader("X-Session", session);
                        },
                        dataType: "json",
                        success: function (data) {
                            homeForm.modal('hide')
                            console.log(data);
                            if (data.data.length>0) {
                                var homework = ("\n<li>\n    <div class=\"message\">\n        <p class=\"teacher\"><span class=\"yu\">" + coursefn(data.data[0].course) + "</span><span class=\"jiang\">" + data.data[0].publisher.name + "老师布置了作业</span><span class=\"date\">" + datefn(data.data[0].publish_at) + "</span></p>\n        <div class=\"work-in\">\n            <p class=\"start\">\n            <span class=\"classify neirong\">作业内容</span><span class=\"definite\">" + homeworkFn(data.data[0].content) + "</span><div class=\"clear\"></div></p>\n            <p><span class=\"classify voice\">语音</span>" + homeworkAud(data.data[0].record_length,data.data[0].record_url) + "</p>\n            <p class=\"end\"><span class=\"classify\">截止时间</span><span class=\"end-date\">" + datefn(data.data[0].deadline) + "</span></p>\n        </div>\n            <p class=\"comment\">共1049条评论</p>\n        <div class=\"comment-in\">\n            <input type=\"text\" placeholder=\"说两句吧\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"bottom\"data-content=\"评论间隔不得小于5秒\"/>\n            <span class=\"button sendMess " +data.data[0].id +"\">发送</span><div sytle=\"clear:both;\"></div>");

                                homework += "<ul class=\"comments\"></ul>"


                                $("ul.homework").html(homework);

                            }

                        },
                        error: function(data){
                            alert("error");
                            console.log(data);
                        }
                    });
                },
                error:function(err){
                    alert("表单提交异常！"+err.msg);
                }
            };
            var homeForm =$("#Modal_homework");
            // 布置作业接受的班级
            var checked = homeForm.find("input[type='checkbox']:checked");
            var checkedG = [];
            if(checked.length<=0){
                alert('请选择班级');
                return ;
            }
            for (var i = 0; i < checked.length; i++) {
                checkedG.push(checked[i].labels[0].innerText);
            }
            jsonObjH["classroom_ids"] = "100418";
            // var iframe = homeForm.find("iframe")[0].contentWindow.document.body.innerText;
            // console.log(JSON.parse(iframe));

            // 作业科目
            var course = homeForm.find("select#project-H");
            jsonObjH["course"] = course.val();

            //通知内容
            var homeCont = homeForm.find("textarea.content");
            if(homeCont.val().trim() ==''){
                alert('请填写作业内容');
                return;
            }
            jsonObjH['content'] = homeCont.val();
            console.log(jsonObjH['content']);
            var endTime = homeForm.find("input[name=endTimes]");
            var reg = /^(?=.*\d.*\b)/;
            // console.log(reg.test(endTime.val()));
            if(!reg.test(endTime.val())){
                alert('请选择作业截止日期');
                return;
            }
            jsonObjH['deadline_at'] = endTime.val();


            // 上传图片文件
            $("#file2").ajaxSubmit(options);


            break;
    }
}


