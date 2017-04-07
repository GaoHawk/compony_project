<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
<!--     <router-view></router-view> -->
    <div class="block">
        <span class="demonstration">日期</span>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions1"
          @change="dateChange">
        </el-date-picker>
    </div>
    <div class="clear"></div>
    <el-table
      :data="tableData"
      :row-style="headRow"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 86.5%;margin-left:7%;"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="time"
        label="日期"
        sortable
        width="130">
      </el-table-column>
      <el-table-column
        prop="school_gw"
        label="学校官网"
        width="80">
      </el-table-column>
      <el-table-column
        prop="purdue_edu"
        label="普度教育"
        width="80"
        >
      </el-table-column>
      <el-table-column
        prop="threeGoods_edu"
        label="三好教育"
        width="80">
      </el-table-column>
      <el-table-column
        prop="help"
        label="帮助"
        width="55">
      </el-table-column>
      <el-table-column
        prop="product_train"
        label="产品培训"
        width="80">
      </el-table-column>
      <el-table-column
        prop="trouble_repairs"
        label="故障保修"
        width="80">
      </el-table-column>
      <el-table-column
        prop="remote_help"
        label="远程协助"
        width="80">
      </el-table-column>
      <el-table-column
        prop="internet"
        label="互联"
        width="55">
      </el-table-column>
      <el-table-column
        prop="moniter"
        label="监测"
        width="55">
      </el-table-column>
      <el-table-column
        prop="media"
        label="影音"
        width="55">
      </el-table-column>
      <el-table-column
        prop="setup"
        label="设置"
        width="55">
      </el-table-column>
      <el-table-column
        prop="U"
        label="U盘"
        width="55">
      </el-table-column>
      <el-table-column
        prop="desktop"
        label="桌面"
        width="55">
      </el-table-column>
      <el-table-column
        prop="close"
        label="关闭"
        width="55">
      </el-table-column>
      <el-table-column
        prop="notice"
        label="通知公告"
        width="80">
      </el-table-column>
      <el-table-column
        prop="cloud_class"
        label="云课堂"
        width="68">
      </el-table-column>
      <el-table-column
        prop="memory"
        label="脑王记忆"
        width="80">
      </el-table-column>
      <el-table-column
        prop="mutually"
        label="交互"
        width="55">
      </el-table-column>
      <el-table-column
        prop="exhibition"
        label="展示"
        width="55">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

export default {
  beforeCreate(){
      var now = new Date();
      var today = now.toLocaleDateString();
      // var today = now.toLocalDateString();
      console.log(now.toLocaleDateString());
      this.$http.get("http://localhost:8081/appdesk/usedata/openPictureDetail",{
            openDate:today,

      }).then(response => {
            console.log(response)
            // console.log(this._data)
            this._data.tableData = response.data.moduleList
      }, response =>{
         console.log(response)
      })
  },
  name: 'app',
  data() {
    return {
      value1:'',
      pickerOptions1:{
         shortcuts:[{
            text:'今天',
            onClick(picker) {
                picker.$emit('pick',new Date());
            }
         },{
            text:'昨天',
            onClick(picker){
               const date = new Date();
               date.setTime(date.getTime() - 3600*1000*24);
               picker.$emit('pick',date);
            }
         },{
            text:'一周前',
            onClick(picker){
               const date= new Date();
               date.setTime(date.getTime() - 3600*1000*24*7);
               picker.$emit('pick',date);
            }
         }]
      },
      tableData: []
    }
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    handleCurrentChange(val){
       this.currentRow = val;
    },
    headRow(row,index){
    },
    dateChange(text){
         this.$http.get("api/table/tomorrow",{

         }).then(response => {
               console.log(response)
               console.log(this._data)
               this._data.tableData = response.data.data
         }, response =>{
            console.log(response)
         })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
th:nth-child(2){
   text-align: center;
}
th>div.cell{
  font-size:12px;
   padding-left: 15px!important;
   padding-right: 15px!important;
}
div.block{
   float:right;
   margin-right: 6%;
}
div.clear{
    clear:both;
}
</style>
