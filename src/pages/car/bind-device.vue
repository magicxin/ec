<template>
	<section id="bind-device" class="bg">
    <!-- <appbar :link="{name:'car-add',query:{hasDeviceInfo:deviceInfoSaved,id:id}}"/>  -->
    <magic-header titleName="绑定设备"></magic-header>
      <!-- <content-with-loading :loaded="loaded"> -->

<!--         <mu-list class="listBg">
          <mu-divider/>
          <mu-list-item :class="[!!warnCode ? 'filled' : '']" title="守卫者预警盒" :afterText="warnCode" @click="openScanWarnQrCode">
            <mu-icon slot="right" value="crop_free"/>
          </mu-list-item>
          <mu-divider/>
        </mu-list>
 -->
        <section class="input-wrapper">
          <mu-text-field label="守卫者预警盒" hintText="请输入SN号或点击右侧扫描二维码" :errorText="warnCodeError" v-model="warnCode" @focus="warnCodeError=''" @blur="warnCodeIsInvalid" labelFloat fullWidth/>          
          <section class="button-wrapper">
            <mu-icon-button icon="crop_free" @click="openScanWarnQrCode"/>
            <!-- <mu-icon-button v-if="warnCode" icon="delete_forever" @click="askDeleteTerminal('warn')"/>             -->
          <i @click="askDeleteTerminal('warn')" v-if="warnCode" class="mu-icon-button material-icons delete_forever">delete_forever</i>

          </section>
        </section>


        <mu-list class="note">
          <mu-list-item title="" afterText="找不到设备吗？看这里" @click="showWarnNote=true">
            <mu-icon value="info_outline" slot="right"/>
          </mu-list-item>
        </mu-list>

<!--         <mu-list class="listBg">
          <mu-divider/>
          <mu-list-item :class="[!!eyeCode ? 'filled' : '']" title="守卫者千里眼" :afterText="eyeCode" @click="openScanEyeQrCode">
            <mu-icon value="crop_free" slot="right"/>
          </mu-list-item>
          <mu-divider/>
        </mu-list>  
 -->        
        <section class="input-wrapper">
          <mu-text-field label="守卫者千里眼" hintText="请输入SN号或点击右侧扫描二维码" :errorText="eyeCodeError" v-model="eyeCode" @focus="eyeCodeError=''" @blur="eyeCodeIsInvalid" labelFloat fullWidth/>          
          <section class="button-wrapper">
              <mu-icon-button icon="crop_free" @click="openScanEyeQrCode"/>
              <!-- <mu-icon-button v-if="eyeCode" icon="delete_forever" @click="askDeleteTerminal('eye')"/> -->
          <i @click="askDeleteTerminal('eye')" v-if="eyeCode" class="mu-icon-button material-icons delete_forever">delete_forever</i>

          </section>
        </section>

        <mu-list class="note">
          <mu-list-item title="" afterText="找不到设备吗？看这里" @click="showEyeNote=true">
            <mu-icon value="info_outline" slot="right"/>
          </mu-list-item>
        </mu-list>

        <mu-dialog :open="showWarnNote">
          <img class="bind-device-note" src="../../assets/obd.png"/>
          <mu-flat-button label="确定" slot="actions" primary @click="showWarnNote=false"/>
        </mu-dialog>

        <mu-dialog :open="showEyeNote">
          <img class="bind-device-note" src="../../assets/record.png"/>
          <mu-flat-button label="确定" slot="actions" primary @click="showEyeNote=false"/>
        </mu-dialog>

        <mu-raised-button label="保存" @click="submit" secondary fullWidth/>

      <mu-dialog class="confirm-delete-terminal-dialog" :open="$route.name=='bind-device' && !!deleteType" title="解绑设备" @close="cancelDelete">
        确定要解绑此设备吗？
        <mu-raised-button slot="actions" @click="cancelDelete" secondary label="不要解绑"/>
        <mu-raised-button slot="actions" primary @click="confirmDelete" label="确定解绑"/>
      </mu-dialog>

      <!-- </content-with-loading> -->
    <mu-snackbar class="center" v-if="showMessage" :message="message" action="关闭" @actionClick="closeMessage" @close="closeMessage"/>
    <!-- <content-with-loading :loaded="!isPosting"/> -->

  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import MuFlatButton from 'muse-components/flatButton'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuIconButton from 'muse-components/iconButton'
  // import MuIcon from 'muse-components/icon'
  // import MuTextField from 'muse-components/textField'
  // import MuDialog from 'muse-components/dialog'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import MuDivider from 'muse-components/divider'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import carDeviceInfo from 'services/car-device-info'
  import scanQrCode from 'utilities/scan-qr-code'
  import calcUriParams from 'utilities/calc-uri-params'
  import deleteDevice from 'services/binded-device-delete'
  export default {
    components: {
      magicHeader
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuSnackbar,
      // MuFlatButton,
      // MuRaisedButton,
      // MuList,
      // MuDivider,
      // MuIcon,
      // MuDialog,
      // MuTextField,
      // MuIconButton
    },
    data() {
      return {
        id:'',
        loaded:false,
        warnCode:'',
        warnId:'',
        warnCodeError:'',
        eyeCode:'',
        eyeId:'',
        eyeCodeError:'',
        message:'',
        isPosting:false,
        showWarnNote:false,
        showEyeNote:false,
        showMessage:false,
        deviceInfoSaved:false,
        deleteType:'',
        fuckingUselessData:{}
      }
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='bind-device'){
            this.initData()
        }
      }
    },
    created(){
      this.initData()
    },
    methods: {
      initData(){
        function clearData(){
          this.loaded=false
          this.warnCode=''
          this.eyeCode=''
          this.warnId=''
          this.eyeId=''
          this.showWarnNote=false
          this.showEyeNote=false
          this.showMessage=false
          this.isPosting=false
          this.deleteType=''
          this.deviceInfoSaved=false
          this.fuckingUselessData={}
        }
        if(this.$route.query.id){
          if(this.id!=this.$route.query.id){
            clearData.bind(this)()
            this.id=this.$route.query.id
            carDeviceInfo.get.bind(this)({
              id:this.id
            },(data)=>{
              console.log(data)
              this.warnCode=data.warnCode
              this.eyeCode=data.eyeCode
              this.warnId=data.warnTerminalId
              this.eyeId=data.eyeTerminalId
              this.fuckingUselessData=data
              this.loaded=true
              this.deviceInfoSaved=!!this.warnCode || !!this.eyeCode
            },(error)=>{
              this.message=error
              this.showMessage=true
            })            
          }
        }else{
          this.message='没有车辆id'
          this.showMessage=true
          // this.loaded=true
        }        
      },
      closeMessage(){
        this.showMessage=false
        this.isPosting=false
      },
      warnCodeIsInvalid(){
        if(this.warnCode){
          return this.warnCodeError=''
        }else{
          return this.warnCodeError=''
        }
      },
      eyeCodeIsInvalid(){
        if(this.eyeCode){
          return this.eyeCodeError=''
        }else{
          return this.eyeCodeError=''
        }
      },
      scanQrCode(para){
        scanQrCode({needResult:true},(response)=>{
          // http://www.vfu365.com/index.html?sn=86S7201604001303
          let terminalCode=calcUriParams.getCustom({
          fullStr:response.resultStr,
          startPoint:'?',
          joinMark:'&',
          setValueMark:'='
         }).sn
        this[para]=terminalCode
        this[para+'IsInvalid']()
        },(err)=>{
          this.message=err
          this.showMessage=true
        })
      },
      openScanWarnQrCode(){
        this.scanQrCode('warnCode')
      },
      openScanEyeQrCode(){
        this.scanQrCode('eyeCode')
      },
      askDeleteTerminal(type){
        this.deleteType=type
      },
      cancelDelete(){
        this.deleteType=''
      },
      confirmDelete(){
        if(this.deleteType=='eye'){
          this.deleteEyeTerminal()
        }else if(this.deleteType=='warn'){
          this.deleteWarnTerminal()
        }
        this.deleteType=''
      },
      deleteWarnTerminal(){
        this.isPosting=true
        deleteDevice.bind(this)({carId:this.id,terminalId:this.warnId},()=>{
          this.warnId=''
          this.warnCode=''
          this.isPosting=false
        },(err)=>{
          this.message=err
          this.showMessage=true
          this.isPosting=false
        })
      },
      deleteEyeTerminal(){
        this.isPosting=true
        deleteDevice.bind(this)({carId:this.id,terminalId:this.eyeId},()=>{
          this.eyeId=''
          this.eyeCode=''
          this.isPosting=false
        },(err)=>{
          this.message=err
          this.showMessage=true
          this.isPosting=false
        })
      },
      submit(){
       if(!!this.warnCode || !!this.eyeCode && !this.warnCodeIsInvalid() && !this.eyeCodeIsInvalid()){
        this.isPosting=true
        this.fuckingUselessData.warnCode=this.warnCode
        this.fuckingUselessData.eyeCode=this.eyeCode
        carDeviceInfo.edit.bind(this)(this.fuckingUselessData,(data)=>{
          this.isPosting=false
          this.deviceInfoSaved=true
          this.$router.push({name:'car-add',query:{id:this.id,hasDeviceInfo:this.deviceInfoSaved}})
        },(err)=>{
          this.isPosting=false
          this.message=err
          this.showMessage=true
        })
       }else{
          this.$router.push({name:'car-add',query:{id:this.id,hasDeviceInfo:this.deviceInfoSaved}})
       }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #bind-device{
    .input-wrapper{
      position:relative;
      .button-wrapper{
        position:absolute;
        right:0;
        bottom:$spaceSmall;
      }
    }
    .mu-item-right{
      right:$spaceSmall*0.4;
    }
  .note{
    margin-top:-16px;
    // margin-bottom:$spaceMedium;
  }
  .mu-list:first-of-type{
    // margin-top:$spaceBig;
  }
  .mu-list .filled{
    .mu-item-after,i{
    color:$colorSecondary;      
    }
  }
  .listBg{
  	background:#fff
  }
  // #listHeader .mu-item-after{
  // 	color:#f98700
  // }
  // #listHeader .mu-icon{
  //   color:#f98700
  // }

  &.mu-raised-button-secondary{
     // background-color:#c60007;
     margin-top:$spaceBig;
   }
}
img.bind-device-note{
  display:block;
  margin:0 auto;
  max-width:100%;
  max-height:100%;
} 
</style>

