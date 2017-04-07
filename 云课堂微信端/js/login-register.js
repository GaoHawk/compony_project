//用户手机号
var phoneNumber;

//班号
var classId;

//页面授权
var session;

/**
 * 登录界面初始化
 */
function loginInit() {

    //切换用户注册与学生注册
    $('.regDiv').click(function () {
        $(this).attr("class", "regDiv")
        if ($(this).attr("id") == "teacherReg") {
            $("#studentReg").attr("class", "current regDiv")
            $("#studentReg a").css("color", "#fff")
            $("#teacherReg a").css("color", "#38afe8")
        }
        else {
            $("#teacherReg").attr("class", "current regDiv")
            $("#teacherReg a").css("color", "#fff")
            $("#studentReg a").css("color", "#38afe8")
        }
    });

    /*
    * 获取默认地点数据
    */
    getCity();
};

/**
 * 注册界面初始化
 * param{type string}注册者身份 "teacher"-老师注册；"student"-学生注册
 */
function registerInit(type) {
    var url = location.href;
    if (type == "teacher") {
        phoneNumber = url.substring(url.indexOf("?") + 1, url.length).split('=')[1];
        if (!phoneNumber || phoneNumber == "" || !(/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber))) {
            window.location.href = "login.html";
        }
        /*
        * 获取默认地点数据
        */
        getCity();

        //加入班级页面，进入下一步
        $("#nextStep").click(function () {
            if ($('.classInfo').text() != "") {
                $("#stepOneDiv").hide();
                $("#stepTwoDiv").show();
            }
        });

        //加入班级页面，返回上一步
        $("#preStep").click(function () {
            $("#stepOneDiv").show();
            $("#stepTwoDiv").hide();
        });
    }
    else if (type == "student") {
        classId = url.substring(url.indexOf("?") + 1, url.length).split('=')[1];
        if (!classId || classId == "" || classId.length < 6) {
            window.location.href = "login.html";
        }
        getClassInfo(classId, 2);


    }
    else {
        return;
    }
}


/*-----------------------------------------用户登录----------------------------------------------*/

/**
 * 用户登录
 */
function userLogin() {
    var $errMsg = $("#userId").parent().parent().find("div");
    console.log($errMsg);
    var userId = $.trim($("#userId").val());
    var password = $.trim($("#usrPsw").val());
    if (userId == "" || (userId.length != 6 && userId.length != 8 && userId.length != 11)) {
        $errMsg.show();
        $errMsg.find("span").text("请正确输入教号(6位)/学号(8位)/手机号(11位)");
    }
    else {

        if (password == "" || password.length < 6) {
            $errMsg.show();
            $errMsg.find("span").text("用户名/密码错误！");
        }

        else {
            var role = 0;
            var data;
            if (userId.length == 6 || userId.length == 11) {
                role = 1;
            }
            else if (userId.length == 8) {
                role = 2;
            }

            if (userId.length == 6 || userId.length == 8) {
                data = "role=" + role + "&user_id=" + userId + "&password=" + password;
            }
            else if (userId.length == 11) {
                data = "role=" + role + "&phone=" + userId + "&password=" + password;
            }

            $.ajax({
                type: "GET",
                url:  "/appdesk/login?" + data,
                contentType: "application/json;charset=UTF-8",  //发送信息至服务器时内容编码类型。
                dataType: "json",   //预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
                success: function (data) {
                    if (data.meta.code == 200) {
                        if (userId.length == 8) {
                            window.location.href = "stu_indexNew.html?id=" + userId + "&session=" + data.data.session;
                        }
                        else {
                            window.location.href = "yunedu/weixin/index.html?id=" + userId + "&session=" + data.data.session;
                        }
                    }
                },
                error: function (data) {
                    var $errMsg = $("#userId").parent().parent().find("div");
                    $errMsg.show();
                    if (data.status == 404) {
                        $errMsg.find("span").text("用户名/密码错误！");
                    }
                    else {
                        $errMsg.find("span").text("登录失败...");
                    }
                }
            });
        }
    }
};

/*-----------------------------------------用户登录(end)----------------------------------------------*/


/*-----------------------------------------用户注册----------------------------------------------*/

/**
 * 用户注册
 * param{type string}注册者身份 "teacher"-老师注册；"student"-学生注册
 */
function userRegister(type) {
    if (type == "teacher") {
        var $errMsg = $("#tpnForReg").parent().parent().find("div");
        phoneNumber = $.trim($("#tpnForReg").val());
        smsCode = $.trim($("#tacForReg").val());
        if (phoneNumber == "" || !(/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber))) {
            $errMsg.show();
            $errMsg.find("span").text("手机号输入有误");
        }
        else {
            if (smsCode == "" || smsCode.length != 4 || (/\D/g).test(smsCode)) {
                $errMsg.show();
                $errMsg.find("span").text("请输入4位验证码");
            }
            else {
                verifyAuthCode(1, phoneNumber, smsCode, $errMsg);
            }
        }
    }
    else if (type == "student") {
        var classId = $("#classId").val();
        if ($('.classInfo').text() != "") {
            window.location.href = "student-register.html?classId=" + classId;
        }
        else {
            var $errMsg = $("#classId").parent().parent().find("div");
            $errMsg.show();
            $errMsg.find("span").text("输入的班号不存在");
        }
    }
};

/**
* 完成注册
* param{type string}注册者身份 "teacher"-老师注册；"student"-学生注册
*/
function finishRegister(type) {
    var $errMsg = $("#userName").parent().parent().find("div");

    var re = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\w])*$/;
    var userName = $.trim($("#userName").val());
    if (userName == "" || !re.test(userName)) {
        $errMsg.show();
        $errMsg.find("span").text("请输入真实姓名");
    }
    else {
        var password = $.trim($("#userPsw").val()) ;
        if (password == "" || password.length < 6) {
            $errMsg.show();
            $errMsg.find("span").text("设置6-20位登录密码");
        }
        else if(!re.test(password)){
            $errMsg.show();
            $errMsg.find("span").text("密码不能包含特殊字符");
        }
        else {
            if ($.trim($("#userPswConfirm").val()) == "" || password != $.trim($("#userPswConfirm").val())) {
                $errMsg.show();
                $errMsg.find("span").text("请确认两次输入密码相同");
            }
            else {
                var role = 0;
                if (type == "teacher") {
                    role = 1;
                    classId = null;
                }
                else if (type == "student") {
                    role = 2;

                    phoneNumber = $.trim($("#spnForReg").val());
                    smsCode = $.trim($("#sacForReg").val());
                    if (phoneNumber != "") {
                        if (!(/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber))) {
                            $errMsg.show();
                            $errMsg.find("span").text("手机号输入有误");
                            return;
                        }
                        else {
                            if (smsCode == "" || smsCode.length != 4) {
                                $errMsg.show();
                                $errMsg.find("span").text("请输入4位验证码");
                                return;
                            }
                            else {
                                var userInfo = {
                                    "role": role,
                                    "phone": phoneNumber,
                                    "classroom_id": classId,
                                    "password": password,
                                    "name": userName,
                                    "sex": 0
                                };
                                verifyAuthCode(2, phoneNumber, smsCode, $errMsg, userInfo);
                                return;
                            }
                        }
                    }/*end of  if (phoneNumber != "")*/
                    else {
                        phoneNumber = null;
                    }
                }/*end of else if (type == "student")*/
                else {
                    return;
                }

                var userInfo = {
                    "role": role,
                    "phone": phoneNumber,
                    "classroom_id": classId,
                    "password": password,
                    "name": userName,
                    "sex": 0
                };

                userReg(type, userInfo, $errMsg);
            }
        }/*end of if(password == "" || password.length < 6)*/
    }/*end of if(userName == "" || !re.test(userName))*/
}

/**
 * 提交用户注册信息
 * param{type string}注册者身份 "teacher"-老师注册；"student"-学生注册
 * param{userInfo json}注册信息
        {
            "role": int,
            "phone": string,
            "classroom_id": string,
            "password": string,
            "name": srting,
            "sex": int
        }
 * param{$errMsg dom} 错误信息提示
 */
function userReg(type,userInfo, $errMsg) {
    $.ajax({
        type: "POST",
        url:"/appdesk/users_pc",
        contentType: "application/json;charset=UTF-8",  //发送信息至服务器时内容编码类型。
        dataType: "json",
        data: JSON.stringify(userInfo),
        success: function (data) {
            if (data.meta.code == 200) {
                if (type == "teacher") {
                    $("#teacherRegDiv").hide();
                    $("#stepOneDiv").show();
                    $("#teacherId").text(data.data.user.id);
                }
                else if (type == "student") {
                    var studentId = data.data.user.id;
                    $("#studentId").text(studentId);
                    $("#showFinishRegModalBtn").click();

                }
                else {
                    return;
                }
                session = data.data.session;
            }
            else {
                $errMsg.show();
                $errMsg.find("span").text("注册失败...");
            }
        },
        error: function (data) {
            var $errMsg = $("#userName").parent().parent().find("div");
            $errMsg.show();
            if (data.status == 409) {
                $errMsg.find("span").text("用户已存在！");
            }
            else {
                $errMsg.find("span").text("注册失败,请稍后重试...");
            }

        }
    });
}

/*-----------------------------------------用户注册(end)----------------------------------------------*/


/*-----------------------------------------找回密码----------------------------------------------*/

/**
 * 修改密码
 * param{type string}用户身份 3-老师修改密码；4-学生修改密码
 */
function changePassword(type) {
    var phoneNumber;
    var authCode;
    var psw;
    var pswConfirm;
    if (type == 3) {
        var $errMsg = $("#tpnForChange").parent().parent().find("div");
        phoneNumber = $.trim($("#tpnForChange").val());
        authCode = $.trim($("#tacForChange").val());
        psw = $.trim($("#tNewPsw").val());
        pswConfirm = $.trim($("#tNewPswConfirm").val());
    }
    else if (type == 4) {
        var $errMsg = $("#spnForChange").parent().parent().find("div");
        phoneNumber = $.trim($("#spnForChange").val());
        authCode = $.trim($("#sacForChange").val());
        psw = $.trim($("#sNewPsw").val());
        pswConfirm = $.trim($("#sNewPswConfirm").val());
    }

    if (phoneNumber == "" || !(/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber))) {
        $errMsg.show();
        $errMsg.find("span").text("手机号输入有误");
    }
    else {
        if (authCode == "" || authCode.length != 4) {
            $errMsg.show();
            $errMsg.find("span").text("请输入4位验证码");
        }
        else {
            if (psw == "" || psw.length < 6) {
                $errMsg.show();
                $errMsg.find("span").text("请输入6-20位新密码");
            }
            else {
                if (pswConfirm == "" || pswConfirm != psw) {
                    $errMsg.show();
                    $errMsg.find("span").text("请确认两次输入密码相同");
                }
                else {
                    verifyAuthCode(type, phoneNumber, authCode, $errMsg);
                }
            }

        }
    }
}



/*-----------------------------------------找回密码(end)----------------------------------------------*/




