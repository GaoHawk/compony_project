
$(function () {
    /*-----------------------------------------表单验证----------------------------------------------*/

    //文本框失去焦点后
    $('form :input').blur(function () {
        var re = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\w])*$/;

        var $parent = $(this).parent();
        $parent.find(".formtips").remove();
        //验证用户名
        if ($(this).attr('name') == "userId") {
            if (this.value == "") {
                $parent.find("label").attr("class", "formValidate");
            }
            else if (this.value.length != 6 && this.value.length != 8 && this.value.length != 11
                ) {
                $parent.find("label").attr("class", "formValidate valFalse");
            } else {
                $parent.find("label").attr("class", "formValidate valTrue");
            }
        }
        //验证密码
        if ($(this).attr('name') == "password") {
            if (this.value == "") {
                $parent.find("label").attr("class", "formValidate");
            }
            else if (this.value.length < 6 || !re.test(this.value)) {
                $parent.find("label").attr("class", "formValidate valFalse");
            } else {
                $parent.find("label").attr("class", "formValidate valTrue");
            }
        }
        //验证密码确认
        if ($(this).attr('name') == "pswConfirm") {
            var password = $parent.parent().find("input[name='password']").val();
            if (this.value == "") {
                $parent.find("label").attr("class", "formValidate");
            }
            else if (password.length < 6 || this.value != password) {
                $parent.find("label").attr("class", "formValidate valFalse");
            } else {
                $parent.find("label").attr("class", "formValidate valTrue");
            }
        }
        //验证手机号码
        if ($(this).attr('name') == "phoneNumber") {
            if (this.value == "") {
                $parent.find("label").attr("class", "formValidate");
            }
            else if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.value))) {
                $parent.find("label").attr("class", "formValidate valFalse");
            } else {
                $parent.find("label").attr("class", "formValidate valTrue");
            }
        }

        //验证验证码
        if ($(this).attr('name') == "authCode") {
            if (this.value == "") {
                $parent.find("label").attr("class", "formValidate");
            }
            else if (this.value.length != 4 || (/\D/g).test(this.value)) {
                $parent.find("label").attr("class", "formValidate valFalse");
            } else {
                $parent.find("label").attr("class", "formValidate");
            }
        }

        //验证用户姓名
        if ($(this).attr('name') == "userName") {
            if (this.value == "") {
                $parent.find("label").attr("class", "formValidate");
            }
            else if (this.value.length > 12 || !re.test(this.value)) {
                $parent.find("label").attr("class", "formValidate valFalse");
            } else {
                $parent.find("label").attr("class", "formValidate valTrue");
            }
        }

    }).keyup(function () {
        $(this).triggerHandler("blur");
        $(".errMsg").hide();
    });//end blur

    //班号输入监听
    $("#classId").keyup(function () {
        $('.classInfo').text("");
        $("#classId").parent().parent().find("div").hide();
        if ($("#classId").val().length == 6) {
            getClassInfo($("#classId").val(), 1);
        }
        $("#nextStep").css("background", "#c9c9c9");
    });

    //班级名称输入监听
    $("#className").keyup(function () {
        $("#className").parent().parent().find(".errMsg").hide();
    });

    //关键字搜素输入监听,当关键字为空，获取默认学校列表
    //$("#findTxt").keyup(function () {
    //    if ($("#findTxt").val() == "") {
    //        $preStage.click();
    //    }
    //});
    /*---------------------------------------表单验证(end)----------------------------------------*/

    /*
    * 根据所选学段，获取学校
    */
    $('.schoolStage').click(function () {
        if ($preStage) {
            $preStage.css("color", "#898989");
        }

        $(this).css("color", "#69c2ec");
        $preStage = $(this);

        var isAll = true;
        if ($preStage.text() != "全部学段") {
            isAll = false;
        }

        //获取选中学段的学校
        getSchool(isAll, false);
    });

});

/*-----------------------------------------查找/创建班级----------------------------------------------*/

//上一个选中的区县
var $preCounty;

//上一个选中学段
var $preStage;

//上一个选中学校
var $preSchool;

//上一个选中班级
var $preClass;

/*
 * 获取城市
 */
function getCity() {
    var provinceId = "430000"
    if ($("#province option:selected").val()) {
        provinceId = $("#province option:selected").val();
    }
    $.ajax({
        type: "GET",
        url:  "/appdesk/docityinfo?id=" + provinceId,
        contentType: "application/json;charset=UTF-8",   //客户端到服务器端返回的数据类型
        dataType: "json",
        success: function (data) {
            console.log(data);
            showLocInfo(data, 1);
            //获取区县
            getCounty(data[0].value);
        }
    });
};

/*
 * 获取区县
 */
function getCounty(cityId) {
    var cityId = cityId;
    if ($("#city option:selected").val()) {
        cityId = $("#city option:selected").val();
        $("#curCity").text($("#city option:selected").text());
    }
    $.ajax({
        type: "GET",
        url: "/appdesk/docountyinfo?id=" + cityId,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (data) {
            showLocInfo(data, 2);
        }
    });
};

/*
 * 获取学校
 * param{isAll bool} 是否获取全部学校
 * param{isFind bool} 是否根据关键字获取学校
 */
function getSchool(isAll, isFind) {
    $("#schoolTable").empty();
    if ($preCounty) {
        var str = 'region_id=' + $preCounty.attr("id");

        if (!isAll && $preStage && $preStage.text() != "全部学段") {
            str += "&type=" + $preStage.text();
        }

        if (isFind && $("#findTxt").val() != "") {
            str += "&find=" + $("#findTxt").val();
        }

        $.ajax({
            type: "GET",
            url: "/appdesk/schools?" + str,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (data) {
                if (data.meta.code == 200) {
                    showLocInfo(data.data, 3);
                }
            }
        });
    }
};


/*
 * 获取班级
 */
function getClasses() {
    if ($preSchool) {
        $.ajax({
            type: "GET",
            url: "/appdesk/classrooms?school_id=" + $preSchool.attr("id").split('-')[0],
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (data) {
                if (data.meta.code == 200) {
                    showLocInfo(data.data, 4);
                }
            }
        });
    }
};

/*
 * 显示信息
 * param{data Arry} 信息数组： [{text:string, value:string}]
 * param{type Int} 地点类型：1-城市；2-区县；3-学校；4-班级
 */
function showLocInfo(data, type) {
    var infoHtml = "";
    switch (type) {
        case 1:
            $("#curCity").val(data[0].text);
            for (var i = 0; i < data.length; i++) {
                infoHtml += '<option value="' + data[i].value + '" >' + data[i].text + '</option>';
            }
            $("#city").empty();
            $("#city").append(infoHtml);
            break;
        case 2:
            $("#schoolTable").empty();
            $("#classTable").empty();
            if (data.length > 0) {
                var cnt = 0;
                for (var i = 0; i < Math.ceil(data.length / 6) ; i++) {   //math.ceil 总是向上舍入为最近的整数   (data.length / 6)这是什么
                    infoHtml += '<tr>';
                    var curCnt = cnt + 6;
                    for (var j = cnt; j < curCnt; j++) {
                        var text = "";
                        var id = "";
                        if (data[j]) {
                            text = data[j].text;
                            id = data[j].value;
                        }
                        infoHtml += '<td  id="' + id + '"><span>' + text + '</span></td>';
                    }
                    infoHtml += '</tr>';
                    cnt += 6;
                }
                $("#countyTable").empty();
                $("#countyTable").append(infoHtml);

                $preSchool = null;
                $preClass = null;
                $("#showClassInfoBtn").css("background", "#c9c9c9");
                $("#createClassBtn").hide();

                /*
                * 选中某个区县
                */
                $('#countyTable td').click(function () {
                    if ($preCounty) {
                        if ($preCounty.attr("id") != $(this).attr("id")) {
                            $preCounty.css("color", "#898989");
                        }
                        else {
                            return;
                        }
                    }
                    $(this).css("color", "#69c2ec");
                    $preCounty = $(this);
                    $preSchool = null;
                    $preClass = null;

                    //获取选中区县的学校
                    if ($preStage) {
                        $preStage.click();
                    }
                    else {
                        $("#allStage").click();
                    }
                });

                //区县hover时，显示气泡
                // $("#countyTable td").each(function () {
                //     if ($(this).text().length > 7) {
                //         $(this).qtip({
                //             content: $(this).text(),
                //             style: {
                //                 tip: 'topLeft'
                //             }
                //         });
                //     }
                // });

                $("#" + data[0].value).click();
            }/*end of if (data.length >= 0)*/
            else {
                $("#countyTable").append("暂无区县");
            }
            break;
        case 3:
            $("#classTable").empty();
            if (data.length > 0) {
                var cnt = 0;
                for (var i = 0; i < Math.ceil(data.length / 4) ; i++) {
                    infoHtml += '<tr>';
                    var curCnt = cnt + 4;
                    for (var j = cnt; j < curCnt; j++) {
                        var text = "";
                        var id = "";
                        if (data[j]) {
                            text = data[j].school_name;
                            id = data[j].id + "-" + data[j].school_type;
                        }
                        infoHtml += '<td id="' + id + '"><span>' + text + '</span></td>';
                    }
                    infoHtml += '</tr>';
                    cnt += 4;
                }
                $("#schoolTable").empty();
                $("#schoolTable").append(infoHtml);

                $preClass = null;
                $("#showClassInfoBtn").css("background", "#c9c9c9");
                $("#createClassBtn").hide();
                /*
                * 选中某个学校
                */
                $('#schoolTable td').click(function () {
                    if ($preSchool) {
                        if ($preSchool.attr("id") != $(this).attr("id") || !newClassId) {
                            $preSchool.css("color", "#898989");
                        }
                        else {
                            return;
                        }

                    }
                    $(this).css("color", "#69c2ec");
                    $preSchool = $(this);
                    $preClass = null;
                    $("#classTable").empty();
                    $("#showClassInfoBtn").css("background", "#c9c9c9");
                    $("#createClassBtn").show();

                    //获取选中学校的班级
                    getClasses();
                });

                //学校hover时，显示气泡
                // $("#schoolTable td").each(function () {
                //     if ($(this).text().length > 11) {
                //         $(this).qtip({
                //             content: $(this).text(),
                //             style: {
                //                 tip: 'topLeft'
                //             }
                //         });
                //     }
                // });

                $("#" + data[0].id + "-" + data[0].school_type).click();
            }/*end of if (data.length >= 0)*/
            else {
                $("#schoolTable").append("暂无学校");
            }
            break;
        case 4:
            if (data.length > 0) {
                var cnt = 0;
                for (var i = 0; i < Math.ceil(data.length / 4) ; i++) {
                    infoHtml += '<tr>';
                    var curCnt = cnt + 4;
                    for (var j = cnt; j < curCnt; j++) {
                        var text = "";
                        var id = "";
                        if (data[j]) {
                            text = data[j].grade + data[j].name;
                            id = data[j].id;
                            infoHtml += '<td id="' + id + '"><span>' + text + '(' + id + ')</span></td>';
                        }
                    }
                    infoHtml += '</tr>';
                    cnt += 4;
                }
                $("#classTable").empty();
                $("#classTable").append(infoHtml);
                /*
                * 选中某个班级
                */
                $('#classTable td').click(function () {
                    if ($preClass) {
                        if ($preClass.attr("id") != $(this).attr("id")) {
                            $preClass.css("color", "#898989");
                        }
                        else {
                            return;
                        }
                    }
                    $(this).css("color", "#69c2ec");
                    $preClass = $(this);

                    $("#showClassInfoBtn").css("background", "#69c2ec");
                });
                if (newClassId) {
                    $("#" + newClassId).click();
                    newClassId = null;
                }
                else {
                    $("#" + data[0].id).click();
                }
            }/*end of if (data.length >= 0)*/
            else {
                $("#classTable").append("暂无班级");
            }
            break;
        default:
            return;
    }
};

/*
 * 通过班级Id获取班级信息
 * param{classId Int} 班级Id
 * param{purpose Int} 查询用途：1-注册；2-验证；
 */
function getClassInfo(classId, purpose) {
    $.ajax({
        type: "GET",
        url: "/appdesk/classrooms/" + classId,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (data) {
            if (data.meta.code == 200) {

                if (purpose == 1) {
                    $('.classInfo').text(data.data.school.school_name + "-" + data.data.grade + data.data.name);
                    $("#nextStep").css("background", "#69c2ec");
                }
            }
            else {
                if (purpose == 1) {
                    var $errMsg = $("#classId").parent().parent().find("div");
                    $errMsg.show();
                    $errMsg.find("span").text("输入的班号不存在");
                }
                else if (purpose == 2) {
                    window.location.href = "login.html";
                }
            }

        }
    });
};


/*
 * 显示创建班级弹窗
 */
function showCreateClassDiv() {
    if ($preSchool) {
        var html = "";
        switch ($preSchool.attr("id").split('-')[1]) {
            case "小学":
                html = '<option value="小学一年级" selected="selected">小学一年级</option>'
                     + '<option value="小学二年级" >小学二年级</option>'
                     + '<option value="小学三年级" >小学三年级</option>'
                     + '<option value="小学四年级" >小学四年级</option>'
                     + '<option value="小学五年级" >小学五年级</option>'
                     + '<option value="小学六年级" >小学六年级</option>';
                break;
            case "中学":
                html = '<option value="初一" selected="selected">初一</option>'
                     + '<option value="初二" >初二</option>'
                     + '<option value="初三" >初三</option>'
                     + '<option value="初四" >初四</option>'
                     + '<option value="高一" >高一</option>'
                     + '<option value="高二" >高二</option>'
                     + '<option value="高三" >高三</option>';
                break;
            case "初中":
                html = '<option value="初一" selected="selected">初一</option>'
                     + '<option value="初二" >初二</option>'
                     + '<option value="初三" >初三</option>'
                     + '<option value="初四" >初四</option>';
                break;
            case "高中":
                html = '<option value="高一" selected="selected">高一</option>'
                     + '<option value="高二" >高二</option>'
                     + '<option value="高三" >高三</option>';
                break;
            case "学前":
                html = '<option value="小班" selected="selected">小班</option>'
                     + '<option value="中班" >中班</option>'
                     + '<option value="大班" >大班</option>'
                     + '<option value="学前班" >学前班</option>';
                break;
            case "职业教育":
                html = '<option value="职教一年级" selected="selected">职教一年级</option>'
                     + '<option value="职教二年级" >职教二年级</option>'
                     + '<option value="职教三年级" >职教三年级</option>';
                break;
            default:
                return;
        }

        $("#selectGrade").empty();
        $("#selectGrade").append(html);

        closeModal();
    }
};

/*
 * 创建班级
 */
var newClassId;
function createClass() {
    if ($preSchool) {
        var $errMsg = $("#className").parent().parent().find(".errMsg");
        if ($("#className").val() == "") {
            $errMsg.show();
            $errMsg.find("span").text("班级名称不能为空");
            return;
        }

        var classInfo = {
            "school_id": $preSchool.attr("id").split('-')[0],
            "grade": $("#selectGrade option:selected").val(),
            "name": $("#className").val(),
            "course": ""
        };
        $.ajax({
            type: "POST",
            url: "/appdesk/classrooms",
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (request) {
                request.setRequestHeader("X-Session", session);
            },
            data: JSON.stringify(classInfo),
            dataType: "json",
            success: function (data) {
                if (data.meta.code == 200) {
                    closeModal();
                    $("#searchClassBtn").click();
                    $preSchool.click();
                    newClassId = data.data.id;
                }
                else if (data.meta.code == 401) {
                    $errMsg.show();
                    $errMsg.find("span").text(data.meta.error_message);
                }
            }
        });
    }
};

/*
 * 加入班级
 * param{type string}加入者身份 "teacher"-老师加入班级；"student"-学生加入班级
 */
function joinClass(type) {
    var userId;
    if (type == "teacher") {
        userId = $("#teacherId").text();
    }
    else if (type == "student") {
        userId = $("#studentId").text();
    }
    var memberInfo = {
        "user_id": userId,
        "name": $("#userName").val(),
        "course": $("#CourseSelect option:selected").val()
    };

    $.ajax({
        type: "POST",
        url: "/appdesk/classrooms/" + $("#classId").val() + "/members",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function (request) {
            request.setRequestHeader("X-Session", session);
        },
        data: JSON.stringify(memberInfo),
        dataType: "json",
        success: function (data) {
            if (data.meta.code == 200) {
                alert("成功加入班级！");
            }
            else {
                var $errMsg = $("#CourseSelect").parent().find(".errMsg");
                $errMsg.show();
                $errMsg.find("span").text(data.meta.error_message);
            }
        }
    });
};

/*
* 显示查找得到的班级信息
*/
function showClassInfo() {
    if ($preClass) {
        $("#classId").val($preClass.attr("id"));
        $('.classInfo').text($preSchool.text() + "-" + $preClass.text());
        $("#nextStep").css("background", "#69c2ec");
        $("#classId").parent().parent().find("div").hide();
        closeModal();
    }
};

//班级管理添加班级
function showClassId(){
    if ($preClass) {
        var class_id = $preClass.attr('id');
        console.log(class_id);
        console.log($preClass);
        var className = $preClass.text().split('(')[0];
        console.log(className);
        console.log($("#add_class input.u_content"));
        var schoolName = $("table#schoolTable td[style='color: rgb(105, 194, 236);'] span").text();
        console.log(schoolName);
        $("#add_class input.u_content").val(class_id).attr('name', className);
        $("#add_class div.form-group.course select").attr('name',schoolName);
        $('#sClass').modal('hide');
        // $('#add_class').modal('show');
        // $("#classId").val($preClass.attr("id"));
        // $('.classInfo').text($preSchool.text() + "-" + $preClass.text());
        // $("#nextStep").css("background", "#69c2ec");
        // $("#classId").parent().parent().find("div").hide();
    }
}

/*-----------------------------------------查找班级(end)----------------------------------------------*/


/*-----------------------------------------获取/验证 验证码----------------------------------------------*/

/**
 * 获取验证码
 * param{obj object}当前点击按钮
 * param{type int}用户类型 "1"-老师注册；"2"-学生注册；"3"-老师找回密码；"4"-学生找回密码
 */
var countdown = 60;
function gainAuthCode(obj, type) {
    if (countdown == 60) {
        var data;
        var $errMsg;

        if (type == 1) {
            data = "role=1";
            phoneNumber = $("#tpnForReg").val();
            $errMsg = $("#tpnForReg").parent().parent().find("div");
        }
        else if (type == 2) {
            data = "role=2";
            phoneNumber = $("#spnForReg").val();
            $errMsg = $("#spnForReg").parent().parent().find("div");
        }
        else if (type == 3) {
            data = "role=1";
            phoneNumber = $("#tpnForChange").val();
            $errMsg = $("#tpnForChange").parent().parent().find("div");
        }
        else if (type == 4) {
            data = "role=2";
            phoneNumber = $("#spnForChange").val();
            $errMsg = $("#spnForChange").parent().parent().find("div");
        }
        else {
            return;
        }
        data += "&phone=" + phoneNumber;

        if (phoneNumber == "" || !(/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber))) {
            $errMsg.show();
            $errMsg.find("span").text("手机号输入有误");
            return;
        }
        else {
            $.ajax({
                type: "GET",
                url:"/appdesk/sendMsg?" + data,
                contentType: "application/json;charset=UTF-8",
                 //发送信息至服务器时内容编码类型。
                dataType: "json",   //预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
                success: function (data) {
                    console.log(data);
                    if (type == 1 || type == 2) {
                        if (data.code == 409) {
                            $errMsg.show();
                            $errMsg.find("span").text("该号码已注册！");
                        }
                        else if (data.code == 200) {
                            sentAuthCode(phoneNumber, $errMsg);
                        }
                    }
                    else {
                        if (data.code == 200) {
                            $errMsg.show();
                            $errMsg.find("span").text("该号码未注册！");
                        }
                        else if (data.code == 409) {
                            sentAuthCode(phoneNumber, $errMsg);
                        }
                    }
                }
            });
        }
    }

    if (countdown == 0) {
        obj.innerText = "获取验证码";
        obj.style.background = "#69c2ec";
        countdown = 60;
        obj.onclick  = function(){
            gainAuthCode(obj,type);
        };
        return;
    } else {
        obj.onclick = function () { };
        obj.style.background = "#c9c9c9";
        obj.innerText = "重新发送(" + countdown + "s)";
        countdown--;
    }
    setTimeout(function () { gainAuthCode(obj, type) }, 1000);
};

/**
 * 发送验证码
 * param{phoneNumber string} 手机号
 * param{$errMsg dom} 错误信息提示
 */
function sentAuthCode(phoneNumber, $errMsg) {
    $.ajax({
        type: "GET",
        url: "/appdesk/sendMsg?phone=" + phoneNumber,
        contentType: "application/json;charset=UTF-8",  //发送信息至服务器时内容编码类型。
        dataType: "json",   //预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        success: function (data) {
            if (data.code != 200) {
                $errMsg.show();
                $errMsg.find("span").text("发送验证码失败！");
            }
            else {
                countdown--;
            }
        }
    });
};


/**
 * 验证验证码是否输入正确
 * param{type int}用户类型 "1"-老师注册；"2"-学生注册；"3"-老师找回密码；"4"-学生找回密码
 * param{phoneNumber string} 手机号
 * param{smsCode string} 验证码
 * param{$errMsg dom} 错误信息提示
 * param{userInfo json}注册信息
        {
            "role": int,
            "phone": string,
            "classroom_id": string,
            "password": string,
            "name": srting,
            "sex": int
        }
 */
function verifyAuthCode(type, phoneNumber, smsCode, $errMsg, userInfo) {
    $.ajax({
        type: "GET",
        url: "/appdesk/verify?phone=" + phoneNumber + "&sms_code=" + smsCode,
        contentType: "application/json;charset=UTF-8",  //发送信息至服务器时内容编码类型。
        dataType: "json",   //预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        success: function (data) {
            if (data.code == 200) {
                if (type == 1) {
                    window.location.href = "teacher-register.html?phone=" + phoneNumber;
                }
                else if (type == 2) {
                    userReg("student", userInfo, $errMsg);
                }
                else {
                    alert("修改密码成功");
                }
            }
            else {
                $errMsg.show();
                $errMsg.find("span").text("验证码输入错误，请检查验证码！");
            }
        }
    });
};




/*-----------------------------------------获取/验证 验证码(end)----------------------------------------------*/

/**
 * 关闭模态窗口
 */
function closeModal() {
    $(".close-reveal-modal").click();
};
