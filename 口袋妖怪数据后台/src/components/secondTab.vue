<template>
<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
  <el-tab-pane label="邮件" name="first">

   <EEmail></EEmail>
  </el-tab-pane>
  <el-tab-pane label="系统邮件" name="second">
     系统邮件
  </el-tab-pane>
  <el-tab-pane label="客户端更新通知" name="third">
    客户端更新通知
  </el-tab-pane>
  <el-tab-pane label="跑马灯" name="fourth">  
    <PaoMa></PaoMa>
  </el-tab-pane>
  <el-tab-pane label="礼品码" name="fifth">
      礼品码
  </el-tab-pane>
</el-tabs>

</template>
<style>
.custom-style{
    text-align: right;
}
.custom-select{
  text-align: right;
  margin-bottom: 3px;
}
</style>
<script>
  import userComponent from './user.vue'
  import character from './character.vue'
  import TTable from './table.vue'
  import EEmail from './email.vue'
  import PaoMa from './sendAllmsg.vue'
  import { mapState, mapActions } from 'vuex'

  export default {


    computed:{
       ...mapState({

       })
    },
    data(){
      return{
          activeName2:'first',
          labelPosition:'left',
           right:{
               mariginLeft:"20px"
           },
           options:[{
              id:1,
              value:'选项1',
              label:'PVE阵容'
           },{
              id:2,
              value:'选项2',
              label:'PVP攻击阵容'
           },{
               id:3,
               value:'选项3',
               label:'PVE防御阵容'
           }],
           value:'选项1'
        }
    },
    components:{userComponent,character,TTable,EEmail,PaoMa},

    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClick(tab,event){
         // console.log(tab,event);
         // if(tab.label == '武将'){
         //   console.log(tab)
         //   this.$http.get("api/table2").then(response => {
         //         this.$store.commit('SET_TABLE',response.data.data)
         //   }, response =>{
         //      console.log(response)
         //   })
         // }
      },
      handleIconClick(ev){
         console.log(ev)
      },
      selectChange(val){
         // if(val == '选项2'){
         //    this.$http.get("api/table2").then(response => {
         //          this.$store.commit('SET_TABLE',response.data.data)
         //    }, response =>{
         //       console.log(response)
         //    })
         // }else{

         // }
      }

    }
  }
</script>
