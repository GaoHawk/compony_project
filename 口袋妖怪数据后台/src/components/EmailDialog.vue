<template>

  <el-dialog title="表单提交" v-model="dialogVisible1" size="tiny"
  :show-close=false
  :close-on-press-escape=false
  :close-on-click-modal =false
  >
    <span> {{ response }} </span>
    <span slot="footer" class="dialog-footer">
  <!--     <el-button @click="dialogVisible1 = false">取 消</el-button> -->
      <el-button type="primary" @click="close_d">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
   import { mapState } from 'vuex'
  export default {
    computed:{
        ...mapState({
            dialogVisible1:state => state.dialogVisible1,
            response:state => state.response
        })
    },
    data() {
      return {

      };
    },
    methods:{
       close_d:function(){
          this.$store.commit('CLOSE_DIALOG1');
       }
    }
  };
</script>
