<template>
  <div id="app">

    <el-row class="tac" :gutter="10">
      <el-col :span="4">
        <h5></h5>
        <el-menu  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
          router
          unique-opened>
          <el-submenu index="1" >
            <template slot="title"><i class="el-icon-message"></i>用户管理</template>
            <el-menu-item-group>
              <template slot="title">账号搜索</template>
              <div class="custom-radio">
                <el-radio class="radio" v-model="radio" label="1">账号UID</el-radio>
                 <el-radio class="radio" v-model="radio" label="2">玩家昵称</el-radio>
              </div>

               <el-input
                 placeholder="请输入账号或者玩家昵称"
                 icon="search"
                 v-model="input2"
                 :on-icon-click="handleIconClick2">
               </el-input>

                  <el-table
                    :data="Datajson"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="zone"
                      label="所在区"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      label="名字"
                      width="90">
                      <template scope="scope">
                          <span style="color:#ff0000;text-decoration:underline;cursor:pointer;" @click="getUserData(scope.$index,scope.row)"> {{ scope.row.nickname }} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="level"
                      label="级别"
                      width="85">
                    </el-table-column>
                  </el-table>
                  <!-- <h3 v-show="nodata">没有找到数据</h3> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-edit"></i>运营管理</template>

              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="2-1"></el-menu-item>
              <el-menu-item index="2-2"></el-menu-item>

          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20">

          <First v-show="tabId == 1"></First>
          <!-- 运营管理表格 -->
          <Second v-show="tabId == 2"></Second>
      </el-col>


    </el-row>
    <secondCom ></secondCom>
    <thirdCom></thirdCom>
  </div>
</template>

<script>

import secondCom from './components/Dialog.vue'
import thirdCom from './components/EmailDialog.vue'
import First from './components/firstTab.vue'
import Second from './components/secondTab.vue'
import { mapState, mapActions } from 'vuex'

export default {
  beforeCreate(){
      // this.$http.get("http://localhost:8081/character/findCharacters",   {
      //   params: {
      //         keyType: 0,
      //         keyValue:2
      //       }
      // }).then(response => {
      //       console.log(response)
      //       console.log(this._data)
      //       // this.$store.commit('SET_TABLE',response.data.data)
      // }, response =>{
      //    console.log(response)
      // })

  },
  name: 'app',
  computed:{
     ...mapState({
          Datajson:state => state.userList,
          tabId:state => state.tabId
     })
  },
  data(){
    return{

         // dialogVisible: false,
         radio:'1',
         input2:'',
         nodata:false
      }
  },
  components:{First,Second,secondCom,thirdCom},

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      this.$store.commit('SET_TABID',key);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleIconClick(ev){
       console.log(ev)
    },
    handleIconClick2(ev){
      console.log(this.radio)
      console.log(this.input2)
      this.$http.get("/pkmOperate/character/findCharacters",   {
        params: {
              keyType: this.radio-1,
              keyValue:this.input2
            }
      }).then(response => {
            console.log(response)
            console.log(this._data)
            this.$store.commit('SET_LIST',response.data);
            // this.Datajson= response.data
            // this.$store.commit('SET_TABLE',response.data.data)
      }, response =>{
         console.log(response)
      })
    },
    getUserData(index,row){
       console.log(index,row)
       this.$store.commit('SET_UID',row.cId);
       this.$http.get("/pkmOperate/character/getUserInfo",   {
         params: {
               id: row.cId
             }
       }).then(response => {
             console.log(response)
             console.log(this._data)
             response.data.type = "占位";
             this.$store.commit('SET_USER',response.data)
       }, response =>{
          console.log(response)
       })
    }

  }
}
</script>

<style>
.custom-radio{
    text-align: left;
    padding-left: 5px;
}
.custom-bottom{
   margin-bottom: 6px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:0 28px;
  margin-top: 60px;
}
.tabs{
   width:66%;
   display: flex;
   position: fixed;
   left: 34%;
   top: 81px;
}
.nav{
  display: inline;
}
</style>
