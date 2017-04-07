<template>
  <mt-header :title="title">
    <div slot="left" >
      <mt-button icon="back" @click.native="back"></mt-button>
    </div>
    <mt-button slot="right" icon="more"></mt-button>
  </mt-header>
</template>
<script>
  import Bus from '../common/bus.js'
  import { mapState, mapActions } from 'vuex'
  export default {
     data(){
        return {
           name:'Top'
        }
     },
     computed:{
        ...mapState({
          title: state => state.title,
          path:state => state.path,
          prePath:state => state.prevPath,
          // 上传文件使用的间隔函数
          st:state => state.stoName
        })
     },
     methods:{
        back:function(){

           if(this.st.length>0){
             clearTimeout(this.st);
           }
           console.log('back')

           this.$store.commit('GO_BACK');
           console.log(this.path);
          //  手动控制router路径 控制页面显示
         //起始页面直接返回跳转，上传页面跳转回布置作业页面 
           if(this.path == '/'|| this.path =='/bar'){
             this.$store.commit('SET_HOME',true);
             sessionStorage.showHome = true;
             console.log(this.path)
           }else{
             this.$store.commit('NEW_TITLE','作业');
           }
          
        },
        setTitle:function(){

        }
     },
     destroyed(){
         const path = this.$router.currentRoute.path;

         this.$store.commit('GET_CURRENTROUTER',path)
     }
  }
</script>
