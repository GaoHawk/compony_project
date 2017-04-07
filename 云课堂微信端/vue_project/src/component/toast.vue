<template>
  <div class="template">
   <child></child>
   <mt-button @click.native="handleClick">Button</mt-button></div>
</template>
<script>
import Header from './header.vue'
export default {
   data(){
      return {
         name:'Toast'
      }
   },
   methods:{
      handleClick:function(){
         this.$toast('Hello world!')
      }
   },
   components:{
       'child':Header
   }
}
</script>
