<template>
    <div class="template">
     <child ref="ref1"></child>
     Bar
     <dropzon maxFiles="1"  ref="myUnique" id="vueDropzone" url="http://localhost:8081/upload/file"  acceptedFileTypes='image/*,audio/*'  v-on:vdropzone-success="showSuccess" :autoProcessQueue="auto"></dropzon>
     <button @click="uploadFile">上传</button>
     <button @click="clearout">重置</button>
     </div>
</template>
<!-- 文件上传组件 -->
<script>
import Header from './header.vue'
import vueDrop from 'vue2-dropzone'
import { mapState } from 'vuex'

export default {
   computed:{
        ...mapState({
            path:state => state.path,
            prePath:state => state.prevPath
        })
   },
   mounted(){
        console.log(this.$refs);
        let arr = []
        arr.push(this.$refs['ref1'])
        console.log(arr);

        // var value = this.$children[1].get autoProcessQueue;
        // console.log(value)
   },
   data(){
      return {
         name:'Bar',
         auto:false
      }
   },
   components:{
       'child':Header,
       dropzon:vueDrop
   },
   methods:{
       'showSuccess':function(file,json){
           console.log(this.$refs);
           console.log(file);
           console.log(json);
           console.log(json.filename);
           console.log(json.smallurl);
           var file = {
               file:json.filename,
               url:json.smallurl
           }
            var store= this.$store;
           store.commit('SET_FILES',file)
           console.log(this.$store);
           var vm = this;
        //   演示完上传动画再返回跳转
           var st = setTimeout(function(){
               console.log(store);
                store.commit('GO_BACK');
                //  手动控制router路径 控制页面显示
                //起始页面直接返回跳转，上传页面跳转回布置作业页面 
                if(vm.path == '/'|| vm.path =='/bar'){
                    store.commit('SET_HOME',true);
                    sessionStorage.showHome = true;
                    console.log(vm.path)
                }else{
                    store.commit('NEW_TITLE','作业');
                }
           },2500)
           store.commit('SET_STO_NAME',st);
           console.log(store);

       },
       uploadFile:function(){
          var files = this.$refs.myUnique;
          // files.dropzone.removeAllFiles(true);
          files.dropzone.processQueue();
          // var queueFile = files.dropzone.getQueuedFiles();
       },
       clearout:function(){
         this.$refs.myUnique.dropzone.removeAllFiles(true);
       }
   }
}
</script>
