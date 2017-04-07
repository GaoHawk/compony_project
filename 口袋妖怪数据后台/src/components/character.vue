<template>
<el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
<el-col :span="12" >
  <el-form-item label="角色id:" class="custom-bottom">
    <el-input v-model="formLabelAlign.name" :disabled="true" icon="plus"
     :on-icon-click="handleIconClick"></el-input>
  </el-form-item>
  <el-form-item label="性别:" class="custom-bottom">
    <el-input v-model="formLabelAlign.region"></el-input>
  </el-form-item>
  <el-form-item label="VIP等级:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="金币:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="级别:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="体力:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="历练:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="掠夺威望:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="季节:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="教学ID:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="充值补单:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  <el-form-item label="首充记录:" class="custom-bottom">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
  </el-col>
  <el-col :span="11" :offset="1">
     <el-form-item label="名称:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="在线" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="刷将消耗:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="元宝:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="经验:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="元气:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="战力:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="战斗场次:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="季节战斗场次:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="关卡解锁:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
     <el-form-item label="军团ID:" class="custom-bottom">
       <el-input v-model="formLabelAlign.type"></el-input>
     </el-form-item>
  </el-col>
</el-form>

</template>
<style>
  .custom-buttonGroup{
     text-align: right;
  }
</style>
<script>
import Dialog from './Dialog.vue'
  export default {
    name: 'app',
    data(){
      return{
          labelPosition:'left',
          formLabelAlign: {
             name: '',
             region: '',
             type: ''
           },

           dialogFormVisible: false,
        }
    },
    components:{

    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClick(tab,event){
         console.log(tab,event);
      },
      handleIconClick(ev){
         console.log(ev)
      },
      // 对话框控制方法
      openDialog:function(msg){
          this.$store.commit('OPEN_DIALOG');
          this.$store.commit('NEW_TITLE',msg);
      }
    }
  }
</script>
