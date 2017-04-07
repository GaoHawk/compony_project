<template >
<div class="template">
    <child></child>
    <div class="custom-notice-content">
      <div class="custom-wrap">
        <label class="custom-label">{{dataJson.title}} </label>
        <p class="custom-content">{{dataJson.value}} </p>
        <span class="custom-badge" >{{dataJson | getLocalDate}}</span>
      </div>
    </div>
  </div>
</template>
<style>
  .custom-notice-content .custom-badge{
     position: absolute;
     right:5px;
     top:114px;
  }
  .custom-notice-content .custom-content{
     height: 100px;
     text-indent:2em;
  }
  .custom-notice-content .custom-label{
      min-width: 70px;
  
  }
  .custom-notice-content .custom-wrap{
        position: relative;
        background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 120% 1px;
        background-repeat: no-repeat;
        background-position: top left;
        background-origin: content-box;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        font-size: 16px;
        line-height: 1;
        min-height: inherit;
        overflow: hidden;
        padding: 0 10px;
        width: 100%;
  }
  .custom-notice-content{
        background-color: #fff;
        box-sizing: border-box;
        color: inherit;
        min-height: 48px;
        display: block;
        overflow: hidden;
        position: relative;
        text-decoration: none;
  }
</style>
<script>
import Header from './header.vue'
import { mapState } from 'vuex'
export default {
   computed:{
       ...mapState({
          dataJson: state => state.currentData
       })
   },
   data(){
      return {
         name:'Foo',

      }
   },
   components:{
      'child':Header
   },
   methods:{
       getChild:function(){
         console.log(this)
         this.$children[0].name = 'Notice'
       },
       result:function(){
            // var app  = this.$parent.$data.todos;
            console.log(app);
       }
   },
   filters:{
     getLocalDate:function(value){
        console.log(value);
        var weekArr = ['日','一','二','三','四','五','六'];
        var date1 = value.published;
        var week = value.week
        var arr  = date1.split('-');
        var year = arr[0];
        var month = arr[1];
        var dd = arr[2];
        return year + '年 '+ month+'月'+ dd +'日 '+ '星期' + weekArr[week];
     }
   }
}
</script>



// WEBPACK FOOTER //
// notice.vue?70a301a9