<template>
<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
  <el-tab-pane label="用户管理" name="first">

  <userComponent></userComponent>
  </el-tab-pane>
  <!--<el-tab-pane label="角色管理" name="second">
  <character></character>
  </el-tab-pane>-->
  <!--<el-tab-pane label="精灵装备" name="third">-->
    <!--精灵装备-->
<!--     <div class="custom-select">
        <el-select v-model="value"  size="mini" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </div>
    <TTable></TTable> -->
  <!--</el-tab-pane>-->
  <!--<el-tab-pane label="材料道具" name="fourth">-->
  <!--材料道具-->
<!--      <div class="custom-style">
       <el-button size="small">赠送武将</el-button>
     </div>
     <TTable></TTable> -->
  <!--</el-tab-pane>-->
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
    components:{userComponent,character,TTable},

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
