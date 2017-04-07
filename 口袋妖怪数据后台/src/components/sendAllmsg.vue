<template>
<el-form :label-position="labelPosition" label-width="85px" :model="noticeForm" :rules="rules" ref="noticeForm">
<el-col :span="14" >
  <el-form-item label="选区:" class="custom-bottom"  prop="checkd" style="min-height:170px;">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
    style="float:left;">全选</el-checkbox>
    <el-checkbox-group v-model="noticeForm.checkedCities" @change="handleCheckedCitiesChange"
      style="text-align:left;" >
      <el-checkbox v-for="city in cities" :label="city"
      style="maring-left:0;" >
      {{city}}</el-checkbox>
    </el-checkbox-group>
    <div style="clear:both;"></div>
  </el-form-item>
  <el-form-item label="有效期限:" class="custom-bottom"  style="height:50px;" prop="date1">
    <el-date-picker
      v-model="noticeForm.date1"
      type="datetimerange"
      placeholder="选择时间范围"
      style="width:100%;">
    </el-date-picker>

  </el-form-item>
  <el-form-item label="间隔时间:"  class="custom-bottom" prop="space" style="height:50px;text-align:left;">
    <el-input  v-model.number="noticeForm.space" placeholder="请设置消息发送间隔" style="width:50%;"></el-input><span>单位:秒</span>
  </el-form-item>
  <el-form-item label="内容:"   class="custom-bottom" prop="content">
    <el-input  type="textarea" resize="none" v-model="noticeForm.content" ></el-input>
  </el-form-item>

  <el-form-item class="custom-buttonGroup1">
    <el-button  @click="sendNotice('noticeForm')" size="small">发送</el-button>
  </el-form-item>
  </el-col>
</el-form>
</template>
<style>
  .custom-buttonGroup1{
     text-align: center;
  }
  .el-textarea__inner{
      height:80px;
  }
</style>
<script>
import EDialog from './EmailDialog.vue'
import { mapState } from 'vuex'
var cityOptions = [];
var arrObj = [];
  export default {
    beforeCreate(){
      this.$http.get("/pkmOperate/operate/getZone").then(response => {
            console.log(response)
            var arr = [];
            for(let i = 0;i< response.data.zoneList.length;i++){
               arr.push(response.data.zoneList[i].zone);
               arrObj.push(response.data.zoneList[i]);
            }
           cityOptions = arr;
           this.cities = cityOptions;
           console.log(cityOptions)
            // cityOptions = response.data;
            // this.$store.commit('SET_USER',response.data)
            // this.$store.commit('SET_RESPONSE',response.data)
            // this.$store.commit('OPEN_DIALOG1');
      }, response =>{
          // this.$store.commit('OPEN_DIALOG1');
          // this.$store.commit('SET_RESPONSE',response.data?response.data:'提交失败');
          console.log(response)
      })
    },
    name: 'app',
    computed:{
       ...mapState({

       })
    },
    data(){
      var validateCheck = (rule,value,callback) =>{
        if (value[0] === null || value[1] === null) {
          console.log(typeof value)
          callback(new Error('请输入正确的时间范围'));
        } else {
        console.log(typeof value)
          callback();
        }
      };
      var validChecklist = (rule,value,callback) =>{
        if(this.noticeForm.checkedCities.length <= 0){
          callback(new Error('至少选择一个区'));
        }else{
          callback();
        }
      };
      return{
          checkAll:true,
          cities: [],
          isIndeterminate: true,
          noticeForm:{
            checkedCities: ['pkm'],
            content:'',
            date1:'',
            space:''
          },
          rules:{
            content:[
              { required:true,message:'请输入邮件内容',trigger:'blur' }
            ],
            date1:[
              { validator: validateCheck, trigger: 'change'  },
              { required:true,message:'不能为空'}
            ],
            checkd:[
              { validator:validChecklist, trigger: 'change' }
            ], 
            space:[
              { required:true,message:'不能为空'},
              { type:'number',message:'时间间隔必须是数字'}
            ]
          },
          labelPosition:'right',
          dialogFormVisible: false,
        }
    },
    components:{
        EDialog
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
      sendNotice:function(formName){
         console.log(this.$refs[formName])
         console.log(this.noticeForm)
         var start = this.noticeForm.date1[0];
         var end = this.noticeForm.date1[1];
         console.log(start);
         var zoneIdarr = [];
         var zonelist = this.noticeForm.checkedCities;
         for(let i = 0;i<arrObj.length;i++){
            for(let j = 0;j<zonelist.length;j++){
              if(arrObj[i].zone == zonelist[j]){
                zoneIdarr.push(arrObj[i].id);
              }
            }
         }
         console.log(zoneIdarr)
         this.$refs[formName].validate((valid) => {
            if(valid) {
                  this.$http.get("/pkmOperate/operate/sendNotice",   {
                    params:{
                      zonelist:zonelist.join(","),
                      zoneIds:zoneIdarr.join(","),
                      content:this.noticeForm.content,
                      startTime:start,
                      endTime:end,
                      elapse:this.noticeForm.space
                    }
                  }).then(response => {
                        console.log(response)

                        // this.$store.commit('SET_USER',response.data)
                        this.$store.commit('SET_RESPONSE',response.data)
                        this.$store.commit('OPEN_DIALOG1');
                  }, response =>{
                     this.$store.commit('OPEN_DIALOG1');
                     this.$store.commit('SET_RESPONSE',response.data?response.data:'提交失败');
                     console.log(response)
                  })

            }else{
               console.log('error submit!!');
               return false;
            }
         })
      },
      handleCheckAllChange(event) {
        this.noticeForm.checkedCities = event.target.checked ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    }
  }
</script>
