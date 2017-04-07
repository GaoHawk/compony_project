<template>

<el-dialog :title="title" v-model="dialogVisible" size="tiny"
 :show-close=false
 :close-on-press-escape=false
 :close-on-click-modal =false
 >
 <!-- 修改密码弹出框 -->
  <el-form :model="form"  :rules="rules" ref="form" :label-position="labelPosition" v-show="title=='修改密码'" >
    <el-form-item  label="新密码" :label-width="formLabelWidth" prop="pwd">
      <el-input type="password" v-model="form.pwd" auto-complete="off" placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="重新输入" :label-width="formLabelWidth" prop="repeat">
      <el-input type="password" v-model="form.repeat" placeholder="请重新输入一次密码" ></el-input>
    </el-form-item>
  </el-form>
<!-- 删除账号弹出框 -->
<el-form :model="form2"  :rules="rules2" ref="form2" :label-position="labelPosition" v-show="title=='删除账号'" >
  <el-form-item  label="是否删除" :label-width="formLabelWidth" prop="msg">
    <el-input  v-model="form2.msg" auto-complete="off" placeholder="确认删除,请输入Y"></el-input>
  </el-form-item>
</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm(title=='修改密码'?'form':'form2')">取 消</el-button>
    <el-button type="primary" @click="submitForm(title=='修改密码'?'form':'form2')">确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    export default {
      data() {
        var validatePass = (rule,value,callback) => {
           if(value === ''){
             callback(new Error('请输入密码'));
           }else if(value.length < 6){
                callback(new Error('密码长度必须不小于6字符'))
           } else{
             if(this.form.checkPass !==''){
                 this.$refs.form.validateField('repeat');
             }
             callback();
           }
        };
        var validatePass2 = (rule,value,callback) =>{
            if(value=== ''){
               callback(new Error('请再次输入密码'))
            }else if(value !== this.form.pwd){
                callback(new Error('两次输入密码不一致'));
            }else{
                callback();
            }
        };
        var validateStr = (rule,value,callback) =>{
            if(value === ''){
               callback(new Error('确认删除,请输入字母Y'))
            }else if(value.toUpperCase() !== 'Y'){
               callback(new Error('确认删除,请输入字母Y'))
            }else{
               callback();
            }
        };
        return {
            form:{
               pwd:'',
               repeat:''
            },
            form2:{
               msg:''
            },
            rules: {
              pwd: [
                { validator:validatePass, trigger: 'blur' },

              ],
              repeat: [
                { validator:validatePass2, trigger: 'blur' }
              ]

            },
            rules2:{
              msg:{
                validator:validateStr, trigger: 'change'
              }
            },
            formLabelWidth: '90px',
            labelPosition:'left'
        }
      },
      computed:{
          ...mapState({
             title:state => state.title,
             dialogVisible:state => state.dialogVisible,
             UID:state => state.userId
          })
      },
      methods:{
          close_dialog:function(){
             this.$store.commit('CLOSE_DIALOG');
          },
          submitForm(formName){
            if(formName !== ''){

              this.$refs[formName].validate((valid) => {
                 if(valid){
                     if(formName === 'form'){
                         var pwd = this.$refs[formName].model['pwd']

                         // 提交新密码
                         if(this.UID){
                           this.$http.get("/pkmOperate/character/updatePWD",   {
                                params:{
                                  uid:this.UID,
                                  newpwd:pwd
                                }
                           }).then(response => {
                                 console.log(response)
                                 console.log(this._data)
                                 // response.data.type = "占位";
                                 // this.$store.commit('SET_USER',response.data)
                                 this.$refs[formName].resetFields();
                                 this.$store.commit('CLOSE_DIALOG');
                           }, response =>{
                              console.log(response)
                           })
                         }
                     }else if(formName === 'form2'){
                        if(this.UID){
                          this.$http.get("/pkmOperate/character/delMember",   {
                                params:{
                                   uid:this.UID
                                }
                          }).then(response => {
                                console.log(response)
                                console.log(this._data)
                                // response.data.type = "占位";
                                // this.$store.commit('SET_USER',response.data)
                                this.$refs[formName].resetFields();
                                this.$store.commit('CLOSE_DIALOG');
                                this.$store.commit('DELETE_USERDATA');
                                this.$store.commit('DELETE_USER',this.UID);

                          }, response =>{
                             console.log(response)
                          })
                        }
                     }

                 }else{
                    console.log('error submit!!')
                    return false;
                 }
              });
            }
          },
          resetForm(formName){
              if(formName !==''){
                console.log(this.$refs['form']);
                this.$refs[formName].resetFields();
              }
              console.log(this.UID);
              this.$store.commit('CLOSE_DIALOG');
          }
      },
      destroyed(){
          console.log(this.$store);
      }
    };
</script>
