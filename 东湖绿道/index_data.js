var list;
var result={};
$(function(){
    if(sessionStorage.userId==null){
        var userInfo = (location.href.split("?")[1]).split("&");
        //保存当前登录用户id
        window.sessionStorage.userId = userInfo[2].split("=")[1];
    }

    $.ajax({
            type:'Get',
            url:"/store/allshops",
            contentType: "application/json;charset=UTF-8",
            dataType:'json',
            success:function (data) {
            	console.log(data);
            	list = data.list;
                var banner ='';
                var adv=data.advert;
                $.each(adv,function(i){
                    var type=adv[i].type;
                    banner += '<div class="swiper-slide">';
                    if(type==0){
                        banner += '<a href="shopInform.html?id='+adv[i].advertInfo+'">';
                    }else if(type==1){
                        banner += '<a href="subpage.html?id='+adv[i].advertInfo+'">'
                    }else if(type==2){
                        banner += '<a href="'+adv[i].advertInfo+'">';
                    }
                    banner += '<img class="pic_animate" src=/resources/upload/advert/' +adv[i].photo +'>';
                    banner += '</a>';
                    banner += '</div>';
                    $(".swiper-container").find('.swiper-wrapper').html(banner);
                    var mySwiper = new Swiper(".swiper-container", {
                        // direction: "vertical",   //垂直布局
                        direction: "horizontal",   //水平布局
                        pagination: '.swiper-pagination',
                        loop: true,  //循环
                        autoplay: 2000,    //自动走
                        autoplayDisableOnInteraction: false,  //控制后继续自动走
                        paginationClickable: true,  //分页器控制滑块
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true,//修改swiper的父元素时，自动初始化swiper

                        // 如果需要分页器
                        pagination: ".swiper-pagination"
                    })
                })
                $.each(list,function (i) {
                    var pos = {};
                    pos.Lng = list[i].inateX;
                    pos.Lat = list[i].inateY;
                    shopList.push(pos);
                    mapObj[list[i].id] = list[i].inateX + "," + list[i].inateY;
                })
                computedDis()
            }
    })
})


 function computedDis(){

    if(!lnglat){
        console.log("no lnglat");
        // if(t1 !== undefined){
        //     clearTimeout(t1);
        // }
       var sto1 =setTimeout(function(){
               computedDis();
       },1000);
        // return;
    }else{
        var arr=[],arrr=[];
        for(var k in mapObj){
            var box=mapObj[k].split(",")[0];
            var boy=mapObj[k].split(",")[1];
            var www= lnglat.distance([box, boy]);
            /*  alert(boy);*/
            var km=((Math.round(www/100)/10).toFixed(1) + "km");       //米换算成千米显示
            mapObj[k] = km;
            for (var key in mapObj) {
                result[key] = mapObj[key]
            }
            //console.log(result);    店铺id与距离值的对应

            var stry = JSON.stringify(result);    //从json对象解析出字符串
            sessionStorage.stringify = stry;

            var am =(Math.round(www/100)/10).toFixed(1);
            //alert('两点间距离为：' + lnglat.distance([box, boy]) + '米');
            //console.log(km);
            arr.push(km);
            arrr.push(am);
        }

        //console.log(mapObj);

        var ids = getSortMapValue(mapObj);
        //重新距离排序后的 商店id顺序
        //console.log(ids);

        // for(var i=0;i<arr.length;i++){
        //     console.log(arr[i]);
        //     $("span[class*=kms]").eq(i).text(arr[i]);
        // }
        for(var i = 0; i<ids.length;i++){
            for(var j=0;j<list.length;j++){
                  if(parseInt(ids[i]) == list[j].id){
                      var id = list[j].id;
                      list[j].distance = mapObj[id];
                      ids[i] = list[j];
                  }
            }
        }
        //console.log(ids);
        var entry='';
        $.each(ids,function (i) {
            var pos = {};
            pos.Lng = ids[i].inateX;
            pos.Lat = ids[i].inateY;
            //console.log(pos);
            shopList.push(pos);
            mapObj[ids[i].id] = ids[i].inateX + "," + ids[i].inateY;

            entry += '<a href="shopInform.html?id='+ids[i].id+'">';
            //entry += '<a onclick="getShopDetail('+ids[i].id+')">';
            entry += '<div class="shop_deta1 clear">';
            entry += '<img class="pic fl" src=/resources/upload/store/'+ids[i].logo+'>';
            entry += '<div class="eastLake fl">';
            entry += '<div class="circ">';
            entry += '<div>'+ids[i].gr_shop+'</div>';
            entry += '<span class="kms fl" id="kilo">'+ids[i].distance+'</span>';
            entry += '<div class="positions clear">';
            entry += '<img class="fl" src="images/home-page/gricon1.png">';
            entry += '<p>'+ids[i].intro+'</p>';
            entry += '</div>';
            entry += '<p class="pt">'+ids[i].content+'</p>';
            entry += '</div>';
            entry += '</div>';
            entry += '<div class="discount">';
            var type = ids[i].type;
            var pay_type = ids[i].pay_type;
            if(type==1){
                entry += '<img src="images/home-page/voucher.png">';
            }
            if(pay_type==1){
                entry += '<img src="images/home-page/book.png">';
            }
            //entry += '<img src="images/home-page/voucher.png">';
            //entry += '<img src="images/home-page/book.png">';
            entry += '</div>';
            entry += '</div>';
            entry += '</a>';
            $("#proDet").html(entry);
        })
    }

 }
 function getSortMapValue(mapObj){
      var mapArr = [];
      for(var k in mapObj){
          mapArr.push(k + ":"+mapObj[k]);
      }
      // 冒泡排序
     var sortArr = bubbleSort(mapArr);
     console.log(sortArr);
     var idArr = [];
     for(var k in sortArr){
         idArr.push(sortArr[k].split(":")[0]);
     }
     return idArr;
 }

 function bubbleSort(array){
    var i = 0,
    len = array.length,
    j, d;
    for (; i < len; i++) {
        for (j = 0; j < len; j++) {
            if (parseFloat(array[i].split(":")[1]) < parseFloat(array[j].split(":")[1])) {
                d = array[j];
                array[j] = array[i];
                array[i] = d;
            }
        }
    }
    return array;
 }
//function getShopDetail(id){
//      console.log(result[id]);
//      window.sessionStorage.distance=result[id];
//      console.log(sessionStorage.distance);
//      location.href="shopInform.html?id="+id+"&distance="+result[id];
//}


