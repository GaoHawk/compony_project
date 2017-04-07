/*
* @Author: Administrator
* @Date:   2016-11-14 10:42:17
* @Last Modified by:   Administrator
* @Last Modified time: 2016-11-26 18:16:31
*/

'use strict';
var userId; //用户Id
var session;    //页面授权
var userName = ""; //用户姓名
var modalN = []; //判断是哪个按钮的弹出框
var event_id = ''; //班级转让id
// 用户班级信息
var classrooms = [];
var sname = '';//新添加学校名称

var str = window.location.search;
if (str.indexOf("id") != -1) {
    userId = str.split('id=')[1].split('&')[0];
}
if (str.indexOf("session") != -1) {
    session = str.split("session=")[1].split('&')[0];
}
if(str.indexOf("userName") != -1){
  userName = str.split("userName=")[1].split('&')[0];
}

function modifyN(that){
     // console.log(that);
    $(that).prop('contentEditable', 'false');
    $(that).next().removeClass('glyphicon-ok').addClass('glyphicon-pencil');
    $(that).next().css({
     "marginLeft": '3px',
     "textDecoration":'underline'
    });
    var user_id = $(that).parent().next().text();
    var jsonClass = new Object();
    jsonClass.name = $(that).text();
    $.ajax({
        type: "put",
        url:  "../users/" + user_id,
        data:JSON.stringify(jsonClass),
        contentType: "application/json;charset=UTF-8",
        beforeSend: function (request) {
            request.setRequestHeader("X-Session", session);
        },
        dataType:"json",
        success:function(data){
              console.log(data);
        },
        error:function(data){
             // $("#gClass").modal('hide');
             var errData = JSON.parse(data.responseText).meta.error_message;
             // $("#def_course").modal('hide');
             var t = setTimeout(function(){
              $("#errorA p").text(errData);
              $("#errorA").modal('show');
             },500);
        }
      });
}

function getNclass(that,sname){
   console.log(that);
   console.log(sname);
   changeClass(that,sname);
}
function nextCourse(a){
  $(".backup").show();
  // 切换到选择科目
  $(a).hide();
  $(a).next().show();
  $(a).next().next().show();
  var content = $(a).parent().prev();
  var class_id = content.children('input').val();
  // content.empty();
  content.parent().find('div.form-group.cn').hide();
  content.parent().find('div.form-group.course').show();
  // var html = '<div class="form-group"><label for="name" name="'+class_id+'">科目</label><select class="form-control"  style="display:inline-block;width:85%;margin-left:6%;"><option>语文</option><option>数学</option><option>英语</option> <option>物理</option><option>化学</option> </select></div>';
  // console.log(content.parent().children().last());
  // $(html).insertBefore(content.parent().children().last());
  $(".navs .step1").css('backgroundColor', '#666');
  $(".navs .step1 .step_btw").css('borderLeft', '15px solid #666');
  $(".navs .step2").css('backgroundColor', '#0095cd');
}

function getClass(classId,sname){
    console.log(classId);
    console.log(classrooms);
    var classData;
    var className ;
    var schoolName;
    var studentInfo;
    var teacherInfo;
    for(var i = 0;i<classrooms.length;i++){
         if(classrooms[i].class_id == classId){
             // console.log(classrooms[i]);
             classData = classrooms[i];
         }
    }

      //设置班级信息以及班级成员
    if(classData == undefined ){
        $.ajax({
          type: "get",
          url:  "../classrooms/"+classId+"/members",
          contentType: "application/json;charset=UTF-8",
          beforeSend: function (request) {
              request.setRequestHeader("X-Session", session);
          },
          dataType:"json",
          success:function(data){
            console.log(data);
            schoolName = sname;
            teacherInfo = [];
            studentInfo = [];
            var mems = data.data.classmembers;
            for (var i = 0; i < mems.length; i++) {
                if(mems[i].role == 1){
                  var t =  new Object();
                  t.course = mems[i].course;
                  t.head_teacher = mems[i].is_head_teacher;
                  t.member_id = mems[i].id;
                  t.name = mems[i].name;
                  t.phone = mems[i].phone;
                  t.user_id = mems[i].user_id;
                  teacherInfo.push(t);
                }else if(data.data[i].role == 2){
                  var s = new Object();
                  s.name = mems[i].name;
                  s.user_id = mems[i].user_id;
                  s.phone = mems[i].phone;
                  s.member_id = mems[i].id;
                  studentInfo.push(s);
                }
            }
            console.log(teacherInfo);
            renderPage(schoolName,studentInfo,teacherInfo,classId);
          },
          error:function(data){
            var errData = JSON.parse(data.responseText).meta.error_message;
            var t = setTimeout(function(){
             $("#errorA p").text(errData);
             $("#errorA").modal('show');
            },500);
          }
        })
    }else{
      className = classData.className;
      schoolName = classData.school;
      studentInfo = JSON.parse(classData.students);
      teacherInfo = JSON.parse(classData.teachers);
      renderPage(schoolName,studentInfo,teacherInfo,classId);
    }



}

function renderPage(schoolName,studentInfo,teacherInfo,classId){
  console.log(teacherInfo);
  var classInfo = $('div.column.content_t');

  classInfo.find(".content_header p").html(schoolName+" &nbsp;&nbsp;&nbsp;        班号:"+classId);
  // console.log(classInfo.find(".content_header p"));

  console.log(teacherInfo);
  var trHtml = '';
  // 判断用户是否为班主任
  var thead = '';
  for (var j = 0; j < teacherInfo.length; j++) {
   trHtml += '<tr class="'+teacherInfo[j].member_id+'" name="'+teacherInfo[j].head_teacher+'"><td>'+teacherInfo[j].name+'</td><td>'+teacherInfo[j].user_id+'</td><td><div style="display:inline-block;">'+teacherInfo[j].course+'</div><i class="glyphicon glyphicon-pencil md" data-toggle="modal" data-target="#def_course"></i></td><td class="md" data-toggle="modal" name="delClm" data-target="#gClass">删除</td></tr>';

     // 如果是班主任功能修改
     if(teacherInfo[j].name == userName ){
        console.log(teacherInfo[j].head_teacher);
        thead += teacherInfo[j].head_teacher;
        console.log(thead);
     }
  }

  classInfo.find("tbody").empty().append(trHtml);

  if(thead.indexOf('1') >= 0){
     console.log('head_teacher');
     $(".class_quit.md[name=dissolveClass]").show();
     $(".class_quit.md[name=transferClass]").show();
     $(".class_quit.md[name=modifyClass]").show();
     $(".class_quit.md[name=quitClass]").hide();
     $("a.footer_btn").css('opacity', '1');
  }else{
    console.log('nh');
    $(".class_quit.md[name=dissolveClass]").hide();
    $(".class_quit.md[name=transferClass]").hide();
    $(".class_quit.md[name=modifyClass]").hide();
    $(".class_quit.md[name=quitClass]").show();
    $("table.teacher i.glyphicon-pencil").css('color', '#9E9E9E');
    $("table.teacher i.glyphicon-pencil").on('click',function(){
        return false;
    });
    $("table.teacher td.md").css('color','#9e9e9e');
    $("table.teacher td.md").on('click', function(event) {
      return false;
      event.preventDefault();
      /* Act on the event */
    });
    $("a.footer_btn").css('opacity', '0');
  }

  //设置班级学生信息
  var studentIn = $(".table.stu_info");

  var stuHtml = '';
  for (var d = 0; d < studentInfo.length; d++) {
    stuHtml += '<tr class="'+studentInfo[d].member_id+'"> <td><div class="stuName" style="display:inline-block">'+studentInfo[d].name+'</div><i class="glyphicon glyphicon-pencil" name="m1"></i></td><td class="letter">'+studentInfo[d].user_id+'</td><td class="letter">'+studentInfo[d].phone+'</td> <td><i class="md" data-toggle="modal" name="resetPwd" data-target="#gClass">重置密码</i>  <i class="md" data-toggle="modal" name="delStu" data-target="#gClass">删除</i></td> </tr>'
  }
  studentIn.find('tbody').empty().append(stuHtml);

  // 姓名修改组件
  $("table.stu_info i.glyphicon").on('click', function(event) {
    console.log(this);
    var m = $(this).attr('name');
    // contentEditable="true"
    if($(this).hasClass('glyphicon-pencil')){
      console.log(3);
      $(this).prev().prop('contentEditable', 'true');
      $(this).removeClass('glyphicon-pencil').addClass('glyphicon-ok');
      $(this).css({
         "marginLeft": '12px',
         "textDecoration":'none'
      });
      $(this).prev().focus();
      $(this).attr('name', 'm2');
    }else if($(this).hasClass('glyphicon-ok')){
      modifyN($(this).prev());
      console.log(2);
      $(this).attr('name', 'm1');
    }

    event.preventDefault();
    /* Act on the event */
  });
  // 完成姓名修改
  $(".stuName").on('focus',function(event) {
      $(this).bind("keydown",function(e){
              // 兼容FF和IE和Opera
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            //回车执行查询
            // console.log("name_foc");
            modifyN(this);
            return false;
        }
      });
  });

  // 修改课程点击事件
  $('i.glyphicon ').on('click',function(event){
       // console.log(this);
       var member_id = $(this).parent().parent().attr('class');
       modalN.push(member_id);
  });
  $('.md').on('click',  function(event) {
    // console.log(this);
    var name  = $(this).attr('name');
    console.log('c');
    modalN.push(name);
    if(name =='delClm'){
      modalN.push($(this).prev().prev().prev().text());
      modalN.push($(this).prev().prev().text());
      modalN.push($(this).prev().text());
      modalN.push($(this).parent().attr('class'));
      console.log(modalN);
    }else if(name =='resetPwd' ){
      var stuName = $(this).parent().prev().prev().prev().text();
      modalN.push(stuName);
      var studentId = $(this).parent().prev().prev().text();
      modalN.push(studentId);
    }else if(name =='delStu'){
      var stuName = $(this).parent().prev().prev().prev().text();
      modalN.push(stuName);
      var className = $("ul.nav.nav-pills li.active a").text();
      var schoolName = $("div.content_header p").text().split(' ')[0];
      modalN.push(className);
      modalN.push(schoolName);
      var member_id = $(this).parent().parent().attr('class');
      modalN.push(member_id);
    }
    event.preventDefault();
    /* Act on the event */
  });
  //表示班级学生人数
  $(".stu_header").next().text("共" + studentInfo.length +"人");
}

function backup(b){
   $(b).hide();
   // 返回选择班号状态
   var content = $(b).parent().next();
   console.log(content);
   content.show();
   content.next().hide();

   $(".navs .step1").css('backgroundColor', '#0095cd');
   $(".navs .step1 .step_btw").css('borderLeft', '15px solid #0095cd');
   $(".navs .step2").css('backgroundColor', '#666');
   var btn = $(b).parent().next().next().next()[0].firstElementChild;
   console.log(btn);
   $(btn).show();
   $(btn).next().hide();
   $(btn).next().next().hide();

}

function changeClass(that,sname){
  // console.log($(that));
  // return false;
  var ligroup = $(that).parent().children();
  var classId = $(that).attr('name');


  if(!$(that).hasClass('custom-border')){

    for (var i = 0; i < ligroup.length-1; i++) {
      $(ligroup[i]).removeClass('active');
    }
    $(that).addClass('active');
    getClass(classId,sname);

  }
}

 // 取消班级转让事件
 function cancel(){
  // console.log(event_id);
  event_id = 1;
  $.ajax({
    type: "delete",
    url:  "../classevents/"+event_id,
    contentType: "application/json;charset=UTF-8",
    beforeSend: function (request) {
        request.setRequestHeader("X-Session", session);
    },
    dataType:"json",
    success:function(data){
          $("#myAlert").hide();

    },
    error:function(data){
      var errData = JSON.parse(data.responseText).meta.error_message;
      $("#def_course").modal('hide');
      var t = setTimeout(function(){
       $("#errorA p").text(errData);
       $("#errorA").modal('show');
      },500);
    }
  })

 }
 // 创建新班级
 function creatClass(a){
   // console.log(a);
   var school_id = $("table#schoolTable td[style='color: rgb(105, 194, 236);']").attr('id').split('-')[0];
   var grade = $(a).prev().children('.class').find('select.form-control').val();
   var className = $(a).prev().children('.class').find('input').val();
   var jsonClass = new Object();
   jsonClass.school_id = school_id;
   jsonClass.grade = grade;
   jsonClass.name = className;
   jsonClass.course = '语文';
   $.ajax({
     type: "post",
     url:  "../classrooms/",
     data:JSON.stringify(jsonClass),
     contentType: "application/json;charset=UTF-8",
     beforeSend: function (request) {
         request.setRequestHeader("X-Session", session);
     },
     dataType:"json",
     success:function(data){
        // console.log(data);
        $("#add_class").modal('hide');
        $("#sClass").modal('hide');
     },
     error:function(data){
       var errData = JSON.parse(data.responseText).meta.error_message;
       $("#def_course").modal('hide');
       var t = setTimeout(function(){
        $("#errorA p").text(errData);
        $("#errorA").modal('show');
       },500);
     }
   })
 }
//表单提交
function submit_form(that,fom){
   // 添加班级方法
   var content = $(that).parent().prev();
   console.log(content);
   var class_id = content.prev().find('input').val();
   var course = content.children('select').val();
   console.log(course);
   var jsonClass = new Object();


   // 退出班级
   if(content.attr('name')){
    fom = content.attr('name');
    console.log(fom);
   }


   switch(fom){
        case 'addClass':
              console.log("添加班级");
              var className = $("#add_class input.u_content").attr('name');
              console.log($("#add_class input.u_content"));
              jsonClass.classroom_id = class_id;
              console.log(class_id);
              jsonClass.course = course;
              jsonClass.user_id = userId;
              jsonClass.name = userName;
              $.ajax({
                  type: "post",
                  url:  "../classrooms/" + class_id + "/members",
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                        console.log(data);
                       var addBtn = $("ul.nav.nav-pills li.custom-border");
                       sname = $("#add_class div.form-group.course select").attr('name');
                       var lihtml = '<li name="'+class_id+'" onclick="getNclass(this,sname);"><a>'+className+'</a></li>';
                       $(lihtml).insertBefore(addBtn);

                       $("#add_class").modal('hide');
                  },
                  error:function(data){
                    $("#add_class").modal('hide');
                    var errData = JSON.parse(data.responseText).meta.error_message;
                    $("#def_course").modal('hide');
                    var t = setTimeout(function(){
                     $("#errorA p").text(errData);
                     $("#errorA").modal('show');
                    },500);
                  }
                });
              break;
        case 'quitClass':
              class_id =  content.attr('class');
              // class_id = 100305;
              $.ajax({
                  type: "post",
                  url:  "../users/" + userId + "/classrooms/" +class_id +"/quit",
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                    $("ul.nav.nav-pills li.active").remove();
                    $("ul.nav.nav-pills li:eq(0)").click();
                       $("#gClass").modal('hide');
                  },
                  error:function(data){
                    $("#gClass").modal('hide');
                    var errData = JSON.parse(data.responseText).meta.error_message;
                    $("#def_course").modal('hide');
                    var t = setTimeout(function(){
                     $("#errorA p").text(errData);
                     $("#errorA").modal('show');
                    },500);
                  }
                });
              break;
         case 'addTeacher':
              class_id = $("ul.nav.nav-pills li.active").attr('name');
              course = $(content.children()[0][0]).val();
              var teacherId = $(content.children()[0][1]).val() ;
              var teacherName = $(content.children()[0][2]).val();
              jsonClass.classroom_id = class_id;
              jsonClass.course = course;
              jsonClass.user_id = teacherId;
              jsonClass.name = teacherName;
              $.ajax({
                  type: "post",
                  url:  "../classrooms/" + class_id + "/members/",
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                        console.log(data);
                       $("#add_teacher").modal('hide');
                       var classInfo = $('div.column.content_t');

                       var trHtml = '<tr class="'+data.data.id+'" name="'+data.data.is_head_teacher+'"><td>'+data.data.name+'</td><td>'+data.data.user_id+'</td><td><div style="display:inline-block;">'+data.data.course+'</div><i class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#def_course"></i></td><td class="md" data-toggle="modal" name="delClm" data-target="#gClass">删除</td></tr>';
                       classInfo.find("tbody").append(trHtml);
                  },
                  error:function(data){
                    $("#add_teacher").modal('hide');
                    var errData = JSON.parse(data.responseText).meta.error_message;
                    $("#def_course").modal('hide');
                    var t = setTimeout(function(){
                     $("#errorA p").text(errData);
                     $("#errorA").modal('show');
                    },500);
                  }
                });
              break;
        case 'delClm':
              class_id = $("ul.nav.nav-pills li.active").attr('name');
              var member_id = content.attr('class').split(" ")[1];
              var currentStu = $("table.teacher tr."+member_id);
              $.ajax({
                  type: "delete",
                  url:  "../classrooms/" + class_id + "/members/"+member_id,
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                       $("#gClass").modal('hide');
                       currentStu.remove();
                  },
                  error:function(data){
                     $("#gClass").modal('hide');
                     var errData = JSON.parse(data.responseText).meta.error_message;
                     var t = setTimeout(function(){
                      $("#errorA p").text(errData);
                      $("#errorA").modal('show');
                     },500);
                  }
                });
              break;
         case 'putEvent':
              console.log("pe");
              $.ajax({
                  type: "put",
                  url:  "../classevents/1",
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                       $("#gClass").modal('hide');
                  },
                  error:function(data){
                       $("#gClass").modal('hide');
                       var errData = JSON.parse(data.responseText).meta.error_message;
                       $("#def_course").modal('hide');
                       var t = setTimeout(function(){
                        $("#errorA p").text(errData);
                        $("#errorA").modal('show');
                       },500);
                  }
                });
              break;
         case 'mdfCourse':
              console.log('mdf');
              class_id = $("ul.nav.nav-pills li.active").attr('name');
              var  member_id = modalN[0]
              course = content.find('select').val();
              modalN.length = 0;
              var currentTe = $("table.teacher tr."+member_id);
              jsonClass.course = course;
              $.ajax({
                  type: "put",
                  url:  "../classrooms/" + class_id + "/members/" + member_id,
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                       $("#def_course").modal('hide');
                       currentTe.find("td:eq(2) div").text(course);
                  },
                  error:function(data){
                       var errData = JSON.parse(data.responseText).meta.error_message;
                       $("#def_course").modal('hide');
                       var t = setTimeout(function(){
                        $("#errorA p").text(errData);
                        $("#errorA").modal('show');
                       },500);

                  }
                });
              break;
          case 'resetPwd':
              console.log('pwd');
              var stuId = content.attr('class').split(' ')[1];
              jsonClass.password = '123456';
              // modalN.length = 0;
              $.ajax({
                  type: "put",
                  url:  "../users/" + stuId + "/password",
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                       $("#gClass").modal('hide');
                  },
                  error:function(data){
                       $("#gClass").modal('hide');
                       var errData = JSON.parse(data.responseText).meta.error_message;
                       $("#def_course").modal('hide');
                       var t = setTimeout(function(){
                        $("#errorA p").text(errData);
                        $("#errorA").modal('show');
                       },500);
                  }
                });
              jsonClass.course = course;
              break;
         case 'delStu':
              var member_id = content.attr('class').split(' ')[1];
              console.log(content);
              class_id = $("ul.nav.nav-pills li.active").attr('name');
              jsonClass.classroom_id = class_id;
              jsonClass.member_id = member_id;
              var currentStu = $("table.stu_info tr."+member_id);
              $.ajax({
                  type: "delete",
                  url:  "../classrooms/" + class_id + "/members/" + member_id,
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                       $("#gClass").modal('hide');
                       currentStu.remove();
                  },
                  error:function(data){
                       $("#gClass").modal('hide');
                       var errData = JSON.parse(data.responseText).meta.error_message;
                       $("#def_course").modal('hide');
                       var t = setTimeout(function(){
                        $("#errorA p").text(errData);
                        $("#errorA").modal('show');
                       },500);
                  }
                });
              break;
         case 'modifyClass':
              class_id = $("ul.nav.nav-pills li.active").attr('name');
              console.log(content);
              var grade = content.find('select').val();
              console.log(grade);
              var name = content.find('input').val();
              console.log(name);
              jsonClass.id = class_id;
              jsonClass.name = name;
              jsonClass.grade = grade;
              $.ajax({
                  type: "put",
                  url:  "../classrooms/" + class_id,
                  data:JSON.stringify(jsonClass),
                  contentType: "application/json;charset=UTF-8",
                  beforeSend: function (request) {
                      request.setRequestHeader("X-Session", session);
                  },
                  dataType:"json",
                  success:function(data){
                       console.log(data);
                       $("ul.nav.nav-pills li.active a").text(data.data.grade+data.data.name);
                       $("#gClass").modal('hide');

                  },
                  error:function(data){
                    console.log(data);
                       $("#gClass").modal('hide');
                       var errData = JSON.parse(data.responseText).meta.error_message;
                       $("#def_course").modal('hide');
                       var t = setTimeout(function(){
                        $("#errorA p").text(errData);
                        $("#errorA").modal('show');
                       },500);
                  }
                });
              break;
          case 'dissolveClass':
                  class_id = $("ul.nav.nav-pills li.active").attr('name');
                  $.ajax({
                      type: "delete",
                      url:  "../classrooms/" + class_id,
                      data:JSON.stringify(jsonClass),
                      contentType: "application/json;charset=UTF-8",
                      beforeSend: function (request) {
                          request.setRequestHeader("X-Session", session);
                      },
                      dataType:"json",
                      success:function(data){
                        console.log(data);
                        $("ul.nav.nav-pills li.active").remove();
                        $("ul.nav.nav-pills li:eq(0)").click();
                           $("#gClass").modal('hide');

                      },
                      error:function(data){
                        console.log(data);
                           $("#gClass").modal('hide');
                           var errData = JSON.parse(data.responseText).meta.error_message;
                           $("#def_course").modal('hide');
                           var t = setTimeout(function(){
                            $("#errorA p").text(errData);
                            $("#errorA").modal('show');
                           },500);
                      }
                    });

   }
}

$(function(){
  // 创建班级方法
  $(".createNew").on('click',function(e){
    console.log('new');
     $(".Class-number table").hide();
     $(".Class-number select").css({
           marginTop:'2%',
     }).show();
     $('.Class-number input').css({
          marginTop:'2%'
     }).show();
     $('span.next').hide();
     $('span.creat').show();
  });

    if (userId  && session){
      // 构造班级信息函数
      function classroom(a,b,c,d){
        this.className = a;
        this.class_id = d;
        this.students = b;
        this.teachers = c;
      }
      // var classroom ={
      //    className: '',
      //    students:[],
      //    teachers:[]
      // }

      function student(a,b,c,d){
        this.name = a;
        this.user_id = b;
        this.phone = c;
        this.member_id = d;
      }
      // var student = {
      //    name:'',
      //    user_id:'',
      //    phone:''
      // }

      function teacher(a,b,c,d,e,f){
        this.name = a;
        this.course = b;
        this.user_id = c;
        this.phone = d;
        this.member_id = e;
        this.head_teacher = f;
      }
      // var teacher = {
      //   name:'',
      //   course:'',
      //   user_id:'',
      //   phone:'',
      // }


      // 获得用户班级转让事件
      $.ajax({
        type: "GET",
        url:  "../users/" + userId + "/classevents",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function (request) {
            request.setRequestHeader("X-Session", session);
        },
        dataType:"json",
        success:function(data){
           event_id = data.data.length>0?data.data[0].id:null;
        }
      });
      // 设置修改课程班级成员id
      $("#def_course").on('show.bs.modal',function(){
            // console.log(this);
      });

      // 根据弹出按钮不同，设置不同提示内容
      $('#gClass').on('show.bs.modal', function () {
          // console.log(this);
          var content = $(this).find("div.modal-body p");
          var title =  $(this).find("h4.modal-title");
          var schoolName = $("div.content_header p").text().split(' ')[0];
          // console.log(schoolName);
          var className = $("ul.nav.nav-pills li.active a").text();
          var classId = $("ul.nav.nav-pills li.active").attr('name');
          switch(modalN[0]){
              case 'quitClass':

                  // console.log(className);
                  // console.log(classId);
                  title.text("退出班级");
                  content.attr({
                    "name": 'quitClass',
                    "class": classId
                  });
                  content.text('您将退出"'+schoolName+className+'",确认退出？');
                  modalN.length = 0;
                  break;
              case 'delClm':
                  title.text('删除教师');
                  content.attr({
                    name: 'delClm',
                    class: classId
                  });
                  content.addClass(modalN[4]);
                  content.text('您将把'+modalN[1]+'('+modalN[3]+')老师从'+schoolName+className+'中删除，确认删除？');
                  modalN.length = 0;
                  break;
              case 'putEvent':
                  title.text('接手班级');
                  content.attr({
                    name: 'putEvent',
                    class: classId
                  });
                  content.text('确认接收后，你将成为该班的班主任，确认接手？');
                  modalN.length = 0;
                  break;
              case 'resetPwd':
                  title.text('重置密码');
                  content.attr({
                    name: 'resetPwd',
                    class: classId
                  });
                  content.addClass(modalN[2]);
                  content.text('您将把'+modalN[1]+'的登陆密码重置为123456，确认重置？');
                  modalN.length=0;
                  break;
              case 'delStu':
                  title.text('删除学生');
                  content.attr({
                    name: 'delStu',
                    class: classId
                  });
                  content.addClass(modalN[4]);

                  content.text('您将把'+modalN[1]+'从'+modalN[3]+modalN[2]+'中删除，确认删除？');
                  modalN.length = 0;
                  break;
              case 'modifyClass':
                  title.text("修改班级");
                  content.attr({
                    "name": 'modifyClass',
                    "class": classId
                  });
                  var html =
                    '<div class="form-group"><label for="name">年级</label><select class="form-control" style="display:inline-block;width:85%;margin-left:6%;"><option>一年级</option><option>二年级</option> <option>三年级</option> <option>四年级</option><option>五年级</option></select></div><div class="form-group"><label for="name">班 名</label><input type="text"  class="form-control u_content" placeholder="输入班级名称" style="display:inline-block;margin-left:6%;width:85%;" data-placement="bottom" data-content="班名不能为空" ></div>'
                  content.html(html);
                  content.css({
                       height:'auto',
                       paddingTop:'5px'
                  });
                  modalN.length = 0;
                  break;
              case 'transferClass':
                  title.text("转让班级");
                  content.attr({
                    "name": 'transferClass',
                    "class": classId
                  });
                  var html =
                  '<div class="form-group"><label for="name">教号</label><input type="text"  class="form-control u_content" placeholder="输入老师教号" style="display:inline-block;margin-left:6%;width:85%;" data-placement="bottom" data-content="教号不能为空" ></div><div class="form-group"><label for="name">姓名</label><input type="text"  class="form-control u_content" placeholder="输入老师姓名" style="display:inline-block;margin-left:6%;width:85%;" data-placement="bottom" data-content="姓名不能为空" ></div><div>注意：姓名和教号需匹配,转让后你将失去该班级控制权</div>';
                  content.html(html);
                  content.css({
                       height:'auto',
                       paddingTop:'5px'
                  })
                  modalN.length = 0;
                  break;
              case 'dissolveClass':
                  title.text("解散班级");
                  content.attr({
                    "name": 'dissolveClass',
                    "class": classId
                  });
                  content.text('您将解散"'+schoolName+className+'",确认解散？');
                  modalN.length = 0;
                  break;
             // case 'mdfCourse':

             //      modalN.length = 0;
             //      break;
          }
          event.preventDefault();
      });
      // $('.md').on('click',  function(event) {
      //   console.log(this);
      //   modalN.push($(this).attr('name'));
      //   console.log(modalN);
      //   event.preventDefault();
      //   /* Act on the event */
      // });








      // 切换班级功能

      $.ajax({
          type: "GET",
          url:  "../users/" + userId + "/classrooms?embed_members=1",
          contentType: "application/json;charset=UTF-8",
          beforeSend: function (request) {
              request.setRequestHeader("X-Session", session);
          },
          dataType:"json",
          success:function(data){
            var classroomsData = data.data;
            console.log(classroomsData);
            var classli = '';
            var fnum = classroomsData.length -1;
            for (var i = fnum; i >= 0; i--) {
                var c =  new classroom();
                var className = classroomsData[i].grade + classroomsData[i].name;

                c.className = className;
                c.school = classroomsData[i].school.school_name;

                c.class_id =classroomsData[i].id;
                classli += "<li name='"+classroomsData[i].id+"''><a>"+className+"</a></li>";
                var teachers = [];
                var students = [];
                for (var j = 0; j < classroomsData[i].classmembers.length; j++) {
                  var mems = classroomsData[i].classmembers[j];
                  if(mems.role ==1){
                      var  t = new teacher();
                      t.name = mems.name;
                      t.course = mems.course;
                      t.user_id = mems.user_id;
                      t.phone = mems.phone;
                      t.member_id = mems.id;
                      t.head_teacher = mems.is_head_teacher;
                      teachers.push(t);
                  }else if(mems.role == 2){
                      var s = new student();
                      s.name = mems.name;
                      s.user_id = mems.user_id;
                      s.phone = mems.phone;
                      s.member_id = mems.id;
                      students.push(s);
                  }
                }
                c.teachers = JSON.stringify(teachers);
                c.students = JSON.stringify(students);

                classrooms.push(c);
            }
            classli +='<li class="custom-border" data-toggle="modal" data-target="#add_class"><a><i class="glyphicon glyphicon-plus"></i> 添加班级</a></li>';
            // console.log(classrooms);
            // 设置用户的班级
            var classNav = $('ul.nav.nav-pills');
            classNav.empty();
            classNav.append(classli);
            // 查找第一个子元素 添加active
            var childClass = classNav.children();

            classNav.find('li').on('click',function(){
                 changeClass(this);
            });
            $(childClass[0]).click();



          },
          error: function (data) {
              console.log(data);
          }
      });
    }



});
