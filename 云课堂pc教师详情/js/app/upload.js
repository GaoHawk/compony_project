/*
* @Author: Administrator
* @Date:   2016-11-03 14:46:41
* @Last Modified by:   Administrator
* @Last Modified time: 2016-11-10 15:53:20
*/

'use strict';
      // 启动提示框插件
    $(function () {
      $("[data-toggle='popover']").popover();
    });

    // 表单数据对象
    var form={

    };
    // 列表对象
    var  ul_grid = $("ul.list-unstyled");
    /**
     * 定义的表单控件对象
     * @type
     */
    // 文件选择框
    var file = $("#inputfile");
    // 文件选择div
    var file_lab = $("#file");
    // 科目
    var project = $("#project");

    // 单选框checkbox
    var checkbox = $(".checkbox input");

    // 网址输入栏div
    var url = $("#Url");
    // 网址输入input
    var url_input = url.find("input");

    // 附件描述
    var desc = $("#description");
    // 附件描述父类div
    var desc_div =  desc.parent();
    // 添加列表识别id
    var num = 1;
    // 监听单选框事件
    // option1 文档类型
    // option2 收藏网页
    checkbox.on("click",function(){
      var input = $(this);
      console.log(checkbox);
      console.log(input);
      var option = input.attr("value");
      if(option == "option1"){
        $(checkbox[0]).attr('checked',true);
        $(checkbox[1]).removeAttr('checked');
        url.hide();
        file_lab.show();
      }else{
        $(checkbox[0]).removeAttr('checked');
        $(checkbox[1]).attr('checked',true);
        url.show();
        file_lab.hide();
      }
    });
    // 默认是上传文档
    url.hide();

    // 标题输入input
    var title = $("#title");
    var title_div = title.parent();


    // var global_var;
    //
    // 表单验证插件
    Form_Validation(title_div,title);
    Form_Validation(url,url_input);
    // Form_Validation(desc_div,desc);


    // 表单验证方法正文
    function Form_Validation(div,input){

/*      var obj_va = {
          "div" : div,
          "input": input
      }
      function inner(){
         return obj_va;
      }

      global_var = inner;*/

      // 获得holder 文字判断是那个输入框，因为没有加id 和class 用这种方式辨别
      var str = input.attr('placeholder');
      // 网址输入 除了验证弹出框，还有辅助输入弹出框
      var booln = str=="输入网址"?true:false;


      // 以下是输入框的blur 和 focus 方法
      input.blur(function(){

        // 定义的全局setTimeout指针
        if(foc !==undefined){
          clearTimeout(foc);
        }

        // 判断为空与否
        var text = input[0].value;
        if(text.length <=0 ){
          // 添加警告样式
          div.addClass('has-warning');
          // 非网址输入框显示验证提示
          if(!booln){
            input.popover('show');
          }else{
                    // 网址输入验证,如果之前的提示框未消失，
                    // 先hide 再显示新的提示框
                    var popover  = url.find("div");

                    if(popover.length > 0){
                      console.log(6);
                      url_input.popover("hide");

                    }else{
                      console.log(7);
                    }
                    // 插件本身限制，代码执行时间需要等待，
                    // 才能重新隐藏再显示新的提示框
                    url_input.attr('data-content', '网址不能为空或格式不正确');
                    var inputb = setTimeout(function(){
                      showBlur(url,url_input,inputb);
                    },200);
            // 插件冲突有bug ，需要自行定义一个提示框，或者检查代码的冲突
          }

        }else{
          // 输入框内有输入，直接关闭提示框，
          // 在提交的时候再验证合法性
          input.popover("hide");
        }
      });
      // 定义的 全局变量n，用于记数提示框展示的次数。
      var n = 0;
      input.focus(function(event) {
         div.removeClass('has-warning');
         var bl = div.hasClass('has-error');
         n = 0;
         // 全局监听，当focus 到一定状态后，讲当前提示框全部隐藏
         window.foc = setTimeout(function(){
            console.log(input.attr('placeholder') + " focus");
            var focuss = input.attr('placeholder');
            if(focuss == "输入网址"){
              // alert("请输入网址");
              url_input.popover("hide");
              title.popover("hide");
            }else{
              // alert("请输入标题");
              url_input.popover("hide");
            }
         },6000);
         // 这是表单验证后，产生的验证提示框
         if(bl){
            var popover  = url.find("div");
            // 同上插件限制，需先隐藏再显示新的提示框
            if(popover.length > 0){
              console.log(8);
              url_input.popover("hide");
            }else{

            }
            var clearE = setTimeout(function(){
              showBlur(div,input,clearE);
            },650);
         }else{
            // 先隐藏之前已经出现的提示框再显示新的
            if(booln){
              var popover  = url.find("div");
              input.attr('data-content', '以http://或https://开头输入网址');
                if(popover.length> 0){
                  input.popover("hide");
                }else{
                  // if(!div.hasClass('has-error')){
                  //   console.log(5);

                  // }
                }
                var inputf = setTimeout(function(){
                  showBlur(div,input,inputf);
                },200);
            }else{
              input.popover("hide");
            }
         }
         event.preventDefault();
      });

      // popover插件方法，这里做多次调用处理
      input.on('show.bs.popover', function () {
         var bl = div.hasClass('has-warning');
         var bl_e = div.hasClass('has-error');

         if(n>0 ){
          // 当调用次数已经超过一次，禁止插件本身的行为，一切归于手动操作
            if(!bl && !bl_e){
              return false;
            }
         }else{
            // 当调用次数为第一次时，且操作对象是输入网址的时候
            // 执行popover插件本身行为
            if(!bl && !bl_e &&!input.attr('placeholder') == "输入网址"){
               return false;
               // 无论什么情况都禁止调用，
               // 输入标题的focus时候的popover插件行为
            }else if(!bl && !bl_e && input.attr('placeholder') == "输入标题"){
              return false;
            }
         }
         n++;
      });
    }

    function delFile(){
      // 是否被选中删除文件
      var delte = $(".list_right input:checked");
      for (var i = 0; i < delte.length; i++) {
          var li_id = $(delte[i]).attr('class');
          $("#"+li_id).remove();
      }
      console.log(delte);
    }
    // 显示新的提示框
    function showBlur(div,input,timer){
      div.removeClass('has-error');
      input.popover("show");
      clearTimeout(timer);
    }
    //清楚定时器，同事取消错误error 样式
    function clearError(div,input,timer){
      div.removeClass('has-error');
      input.popover("hide");
      clearTimeout(timer);
    }

    // 表单form submit方法，所有对象保存到form 对象中
    function submit_form(){
      var bool = false;
      var url_check = url.find("input")[0].value;
      console.log(url.find("input"));
      form.url = null;

      if(url){
        bool = cl_url(url_check);
        console.log(bool);
      };

      if(bool){
        form.url = url_check;
      }
      // console.log(title[0].value);
      form.project = project[0].value;
      for (var i = 0; i < checkbox.length; i++) {
        var radio = $(checkbox[i]);
         var ck = radio.attr("checked");
         if(ck){
             form.type = radio.attr('value');
         }
      }
      // console.log(file);
      form.file = file[0].files[0];
      form.title = title[0].value;
      document_write(form);

      if(!form.title){
        title_div.addClass('has-error');
        // title.focus();
      }
      // 有地址错误focus到url栏，没有focus到标题栏
      if(!form.url){
        url_input.attr('data-content', '网址不能为空或格式不正确');
        url_input.val("");
        url.addClass('has-error');
        url_input.focus();
      }else{
        title.focus();
      }
    }

    // 在提交form 数据后页面加载方法
    function document_write(data){
      console.log(data);
      num++;
      // 课程
      var project = data.project;
      var charP = project.charAt(0);
      console.log(charP);
      var color = null;
      switch(charP){
          case "数":
              color = '#299fca';
              break;
          case "英":
              color = '#77bb9b';
              break;
          case "地":
              color = '#34a78b';
              break;
          case "史":
              color = '#efae97';
              break;
          case "生":
              color = '#e8c462';
              break;
          case "化":
              color = '#cc74c2';
              break;
          case "物":
              color = '#8ad276';
              break;
      }
      // 标题
      var title = data.title;
      // 数据类型
      var data_type = data.type;

      //获得编辑文档当前时间
      var d = new Date()
      console.log(d.toLocaleString());
      var now = d.toLocaleString();

      var url = data.url;

      var html =
      '<li class="lessons_file" id="item' + num + '">' +
        '<div class="bgIcon" style="background-color:' + color + '">' + charP +'</div>' +
        '<span style="float:left;margin-top:3px; margin-left:21px;">' +
          title +
          '<br>' ;
          console.log(data_type);
      if(data_type == "option1"){
          html += '<span style="margin-right:5px;">文件 : 34M</span><i style="margin-right:5px;">5</i><a href="#" style="text-decoration: none;" onclick="downfile();">下载</a>'
      }else{
        console.log(4);
        html +='<a href="'+ url +'" >' + url + '</a>'
      }
         html +=
        '</span>' +
        '<span class="list_right"><p style="margin-bottom:6px;">' + now + '</p>' +
          '<label style="margin-left:95px;margin-bottom:2px;">' +
            '<input type="checkbox" class="item' + num +'">' +
          '</label>' +
        '</span>' +
        '<div style="width:94%;height:.8px;margin-left:6%;padding:0px;background-color:#b7b7b7;overflow:hidden;position:relative;bottom:5px;"></div>' +
      '</li>';
      ul_grid.append(html);
      $("#myModal").modal('hide');
    }

    // $('#myModal').on('shown.bs.modal', function () {
    //     var input = $("#myModal").find('input.u_content');
    //     for (var i = 0; i < input.length; i++) {
    //         input[i].value = '';
    //     }
    //     // form = {};
    //     console.log(form);
    //   // console.log(input);
    // })

    function downfile(){
       alert(2);
    }
    // 验证网址合法性
    window.cl_url = function(str){
      var reg = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
      var re = new RegExp(reg);
      if(re.test(str)){
        console.log("true");
        return true;
      }else{
        console.log("false");
        return false;
      }
    }
