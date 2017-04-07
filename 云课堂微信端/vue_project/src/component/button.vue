<template>
  <div class="page-button">
  <mt-button type="default" @click.native="router_h">布置作业</mt-button>
  <mt-button type="primary" @click.native="router_n">发布通知</mt-button>
  </div>
</template>

<script>
import Bus from '../common/bus.js'
export default {
  name: 'button',

  methods:{
    router_h:function(event){
         this.$store.commit('NEW_TITLE','作业');
         // this.$parent.$router.push({path:'/foo'})
         this.$store.commit('ROUT_PATH','/foo');
         this.$store.commit('SET_PREPATH','/');
         this.$store.commit('SET_HOME',false);
         sessionStorage.showHome = false;
      

    },
    router_n:function(){
        this.$store.commit('NEW_TITLE','通知');
        this.$store.commit('ROUT_PATH','/c_notice');
        this.$store.commit('SET_PREPATH','/');
        this.$store.commit('SET_HOME',false);
        sessionStorage.showHome = false;
        // this.$parent.$router.push({path:'/bar'})

    }
  }
};
</script>

<style lang="css">
  .page-button{
    text-align: center;
    margin-top: 20px;
  }
  @component-namespace page {
    @component button {
      padding: 0 15px 15px;

      @descendent group {
        margin-bottom: 15px;

        & > * {
          margin-bottom: 15px;
        }
      }
    }
  }
</style>



// WEBPACK FOOTER //
// button.vue?16f40e16