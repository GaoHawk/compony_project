<template>

  <el-table
      :data="tableData"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      row-class-name="styleObj"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        label="武将"
        width="130">
        <template scope="scope">
            <a @click="openDialog('武将数据')" style="color:#ff0000;text-decoration:underline;position:relative;top:3px;cursor:pointer;">{{ scope.row.general}} </a>
            <div style="font-size:10px;">{{ scope.row.generalID }} </div>
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        label="星级"
        width="50">
      </el-table-column>
      <el-table-column
        property="address"
        label="级别"
        width="50">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="力量"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="智力"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="敏捷"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="耐力"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="物攻"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="法攻"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="物防"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="法防"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="速度"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="生命"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="命中"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="闪避"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="暴击"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="抗暴"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="攻强"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="减伤"
        width="65">
      </el-table-column>
      <el-table-column
        property="liliang"
        label="穿甲"
        width="65">
      </el-table-column>
      <el-table-column
        property="zhenqi"
        label="真气"
        width="50">
      </el-table-column>
    </el-table>
    <!-- <sselect></sselect> -->
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    computed:{
       ...mapState({
         tableData: state => state.currentData,

       })
    },
    data() {
      return {
        currentRow: null,

      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      openDialog:function(msg){
        this.$store.commit('OPEN_DIALOG');
        this.$store.commit('NEW_TITLE',msg);
      }
    }
  }
</script>
<style>
  .el-table .cell,
  .el-table th>.cell{
     padding-right: 10px!important;
     padding-left: 10px!important;
     text-align: center;
  }

</style>
