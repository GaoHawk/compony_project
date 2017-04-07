<template>
<el-form :label-position="labelPosition" label-width="80px" :model="emailForm" :rules="rules" ref="emailForm">
<el-col :span="14" >
  <el-form-item label="收件人:" class="custom-bottom" prop="characters" style="height:50px;">
    <el-input v-model="emailForm.characters"  placeholder="多个玩家之间用逗号隔开"></el-input>
  </el-form-item>
  <el-form-item label="标题:" class="custom-bottom" prop="title" style="height:50px;">
    <el-input v-model="emailForm.title" ></el-input>
  </el-form-item>
  <el-form-item label="内容:" class="custom-bottom" prop="content" style="height:100px;">
    <el-input type="textarea" resize="none"  v-model="emailForm.content" ></el-input>
  </el-form-item>
  <el-form-item label="金币:"   class="custom-bottom" prop="g_cash">
    <el-input  v-model="emailForm.g_cash" ></el-input>
  </el-form-item>
  <el-form-item label="元宝:"   class="custom-bottom" prop="m_cash">
    <el-input  v-model="emailForm.m_cash" ></el-input>
  </el-form-item>
  <el-form-item label="赠送物品:"   class="custom-bottom" prop="items" style="height:91px;">
    <el-input type="textarea" resize="none" v-model="emailForm.items" placeholder="格式:物品id-数量,多个物品用逗号隔开" ></el-input>
  </el-form-item>
  <el-form-item class="custom-buttonGroup1">
    <el-button  @click="sendEmail('emailForm')" size="small">发送</el-button>
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
  export default {
    name: 'app',
    computed:{
       ...mapState({

       })
    },
    data(){
      var checkCharFomat = (rule,value,callback) =>{
         if(value === ''){
            callback(new Error('请输入收件人'));
         } else if(value.length > 0 ){
            for(let j=0;j<value.length;j++){
                 console.log(value.charCodeAt(j))
                if(value.charCodeAt(j) > 65248 || value.charCodeAt(j)==12288){
                    callback(new Error('有全角字符格式不正确,请输入半角字符'))
                    return;
                }
            }
            var strArr = value.split(',');
            var bl = true;
            for(let i=0;i<strArr.length;i++){
               if(strArr[i].trim() == ''){
                  bl = false;
               }
            }
            if(!bl){
              callback(new Error('请输入正确的格式,以逗号分割用户'));
            }
         }
         callback();
      };
      var checkItemFomat = (rule,value,callback) =>{
         if(value === ''){
            callback(new Error('请输入要赠送的物品'));
         } else if(value.length > 0){
          for(let j=0;j<value.length;j++){
               console.log(value.charCodeAt(j))
              if(value.charCodeAt(j) > 65248 || value.charCodeAt(j)==12288){
                  callback(new Error('有全角字符格式不正确,请输入半角字符'))
                  return;
              }
          }
            var sArr = value.split(",");
            var b = true;
            for(let i=0;i<sArr.length;i++){
               if(sArr[i].trim() == ''){
                  b = false;
               }else {
                   if(sArr[i].trim().indexOf('-') < 0){
                       b = false;
                   }
               }
            }
            if(!b){
                callback(new Error('请输入正确的格式:物品id加"-"物品数量,不同物品以逗号间隔'));
            }
         }
         callback();
      };
      return{
          emailForm:{
            characters:'',
            g_cash:'',
            m_cash:'',
            title:'',
            content:'',
            items:''
          },
          rules:{
            title:{
               required:true, message:'请输入标题', trigger:'change'
            },
            content:{
               required:true,message:'请输入邮件内容',trigger:'change'
            },
            characters:{
               validator:checkCharFomat, trigger:'blur'
            },
            items:{
               validator:checkItemFomat, trigger:'blur'
            }
          },
          labelPosition:'left',
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
      sendEmail:function(formName){
         console.log(this.$refs[formName])
         console.log(this.emailForm)
         this.$refs[formName].validate((valid) => {
            if(valid) {
                  this.$http.get("/pkmOperate/operate/sendMail",   {
                       params:{
                       characters:this.emailForm.characters,
                       g_cash:this.emailForm.g_cash,
                       m_cash:this.emailForm.m_cash,
                       title:this.emailForm.title,
                       content:this.emailForm.content,
                       items:this.emailForm.items
                       }
                  }).then(response => {
                        console.log(response)

                        // this.$store.commit('SET_USER',response.data)
                        this.$store.commit('SET_RESPONSE','邮件发送成功')
                        this.$store.commit('OPEN_DIALOG1');
                  }, response =>{
                     this.$store.commit('OPEN_DIALOG1');
                     this.$store.commit('SET_RESPONSE','提交失败')
                     console.log(response)
                  })

            }else{
               console.log('error submit!!');
               return false;
            }
         })
      }
    }
  }
</script>
