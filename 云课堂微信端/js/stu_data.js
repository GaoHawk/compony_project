var userId=window.location.search.split('id=')[1].split('&')[0];                //用户Id
console.log(userId);
var session = window.location.search.split("session=")[1].split('&')[0];        //页面授权
console.log(session);

$(function () {
    $(window).scrollTop(0);
    // 所有作业数据
    var homework_g = [];
    var n = 0;
    $(window).scroll(function(){
        //console.log(n);
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
            }else{
                n = 0;
            }
        }
    })
    // 滚动加载页面
    function renderHomDom(data){
        console.log(data);
        var homework='';
        for (var j = 0; j < data.data.length; j++) {
            app.dynamics.push(data.data[j]);
            app.dynamics[j].publisher_name=data.data[j].publisher.name;
            app.dynamics[j].content=homeworkFn(data.data[j].content);      //作业内容
            app.dynamics[j].course=coursefn(data.data[j].course);          //科目截取字符串
            app.dynamics[j].publish_at=datefn(data.data[j].publish_at);    //发布时间截取字符串
            app.dynamics[j].deadline=datefn(data.data[j].deadline);        //截止时间截取字符串
            if(data.data[j].record_length>0){
                app.dynamics[j].record_length=data.data[j].record_length+'”';
                app.dynamics[j].record_url=homeworkAud(data.data[j].record_url);
            }else{
                app.dynamics[j].record_length='没有语音'
            }


            //获取作业评论
            var comments = data.data[j].comment?data.data[j].comment:'';
            console.log(comments);
            if(comments.length > 0){
                for (var a = 0; a < comments.length; a++) {
                    app.dynamics[0].infors.push(comments[a])

                }
            }
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
            url: "../users/" + userId,
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("X-Session", session);
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                var userName = data.data.name;           //用户姓名
                console.log(userName);
                app.user_name = userName;
            },
            error: function (data) {
                console.log(data);
            }
        });


        // 获取用户班级信息
        //$.ajax({
        //    type: "GET",
        //    url:  "../users/" + userId +'/classrooms?embed_members=1',
        //    contentType: "application/json;charset=UTF-8",
        //    beforeSend: function (request) {
        //        request.setRequestHeader("X-Session", session);
        //    },
        //    dataType: "json",
        //    success: function (data) {
        //        console.log(data);
        //        var teaNumber='';
        //        var stuNumber='';
        //        if (data.data.length>0) {
        //            console.log(data.data[0]);
        //            var classmem=data.data[0].classmembers;
        //            console.log(classmem);
        //            var classrooms_id_group = [];
        //            for (var i = 0; i < data.data.length; i++) {
        //                classrooms_id_group.push(data.data[i].id);
        //                var myClass = ("\n<li >\n    <div class=\"class-txt\">\n        <p class=\"schools\">" + data.data[i].school.school_name + data.data[i].grade + data.data[i].name + "</p>\n        <p><span>班号："+data.data[i].id +"</span><span class=\"copy\">   复制</span></p>\n       <p>教师：" + classTnfn(data.data[i].classmembers) + "【教号:" + classTfn(data.data[i].classmembers) + "】</p>\n    </div>\n</li>\n");
        //                $(".class ul").append(myClass);
        //
        //            }
        //            var classrooms_ids = classrooms_id_group.join();
        //
        //
        //            var stuArr=[];
        //            for(var i=0;i<classmem.length;i++){
        //                var role=classmem[i].role;
        //                console.log(role);
        //
        //                //老师数据
        //                teaNumber +='<tr>';
        //                if(role==1){
        //                    teaNumber +='<td>'+ classmem[i].name +'</td>';
        //                    teaNumber +='<td>'+ classmem[i].user_id +'</td>';
        //                    teaNumber +='<td>'+ classmem[i].course +'</td>';
        //                }
        //                teaNumber +='</tr>';
        //                $("#accountBook tr:gt(0)").remove();
        //                $("#accountBook").append(teaNumber);
        //
        //                //学生数据
        //                if(role==2){
        //                    stuNumber +='<tr>';
        //                    stuNumber +='<td>'+ classmem[i].name +'</td>';
        //                    stuNumber +='<td>'+ classmem[i].user_id +'</td>';
        //                    stuNumber +='</tr>';
        //                    $(".studentId tr:gt(0)").remove();
        //                    $(".studentId").append(stuNumber);
        //                    stuArr.push(stuNumber);
        //                    //console.log(stuArr);
        //                    $(".peopleNum").text(stuArr.length);
        //                }
        //            }
        //        }
        //    }
        //    //error: function (data) {
        //    //    // console.log(data);
        //    //    // window.location.href = "login.html";
        //    //}
        //});
    }

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
                            "<li><a>"+ (j+1) +"</a></li>"
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
    // 发表评论
    function writeClientMessage(that,userName){
        var now = new Date();
        console.log($(that).attr('class'));
        var homework_g = $(that).attr('class').split(" ");
        var homework_id = homework_g[2]?homework_g[2]:'';
        console.log(homework_id);
        var chartM = $(that).prev().val();
        var chartP = $(that).parent();
        // console.log(chartM);
        var messUl = $(that).next().next();
        // console.log(messUl);
        // console.log(functionTime);
        // console.log(now);
        if(functionTime !== undefined){
            var date3 = now.getTime() - functionTime.getTime();
            var seconds =date3/1000;
            console.log(seconds);
            if(seconds >= 5){
                functionTime  = now;
            }else{
                $(that).prev().popover('show');
                return;
            }
        }else{
            functionTime  = now;
        }
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
        chartP.find("ul li:gt(2)").remove();
        // 验证完成提交评论信息
        $.ajax({
            type:"post",
            url:  "../sendComment",
            data:JSON.stringify(mesJson),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success:function(data){
                console.log(data);
                // 评论恢复 刷新页面

                if(data.data.length > 0){
                    if(data.data.length > 3){
                        data.data.length =3;
                    }
                    console.log(data);
                    messUl.empty();
                    var li_ajx = '';
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i]
                        li_ajx += "<li><p><span class='name'>"+data.data[i].user_name+":  </span><span>"+ data.data[i].content + "</span></p></li>";
                    }
                    messUl.append(li_ajx);
                }
            },
            error:function(data){
                console.log(data);
            }
        });
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

