<template>
  <section id="car-information" class="bg">
    <!-- <appbar :link="{name:'car-add'}"/> -->
    <magic-header titleName="车辆信息"></magic-header>
      <mu-text-field hintText="车牌号"  :errorText="carIdError" v-model="carId" @focus="carIdError=''" @blur="carIdIsInvalid" fullWidth/><br/>
      <mu-select-field label="品牌" :maxHeight="200" hintText="请选择品牌" fullWidth labelFloat class="selectField">
        <mu-menu-item v-for="item, index in list" :title="item" :value="index"/>
      </mu-select-field>
      <mu-select-field label="系列" :maxHeight="200" hintText="请选择品牌" fullWidth labelFloat>
        <mu-menu-item v-for="item, index in list" :title="item" :value="index"/>
      </mu-select-field>
      <mu-select-field label="型号" :maxHeight="200" hintText="请选择品牌" fullWidth labelFloat>
        <mu-menu-item v-for="item, index in list" :title="item" :value="index"/>
      </mu-select-field>
      <mu-text-field hintText="车辆识别代号" fullWidth/><br/>
      <mu-text-field hintText="发动机号"  fullWidth/><br/>
      <mu-list>
        <mu-list-item title="" afterText="找不到以上信息吗？看这里">
          <mu-icon value="info_outline" slot="right" @click="open"/>
        </mu-list-item>
      </mu-list>
      <mu-dialog :open="dialog">
        <mu-avatar :src="avatar1" :size="200"/>
        <mu-flat-button label="确定" slot="actions" primary @click="close"/>
      </mu-dialog>
       <mu-raised-button label="保存信息" class="delete" @click="submit" secondary fullWidth/>
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import MuAppbar from 'muse-components/appbar'
  // import MuFlatButton from 'muse-components/flatButton'
  // import MuPopup from 'muse-components/popup'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuTextField from 'muse-components/textField'
  // import MuPicker from 'muse-components/picker'
  // import MuAvatar from 'muse-components/avatar'
  // import MuDivider from 'muse-components/divider'
  // import MuSubHeader from 'muse-components/subHeader'
  // import MuIcon from 'muse-components/icon'
  // import MuSelectField from 'muse-components/selectField'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import {menu as MuMenu,menuItem as MuMenuItem} from 'muse-components/menu'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import queryAddress from 'services/peccancy-query-cities'
  import validate from 'services/peccancy-query-validate'
  // import MuDialog from 'muse-components/dialog'
  import avatar1 from 'assets/avatar1.jpg'
  export default {
    components: {
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuSnackbar,
      // MuAppbar,
      // MuFlatButton,
      // MuPopup,
      // MuRaisedButton,
      // MuTextField,
      // MuPicker,
      // MuMenu,
      // MuMenuItem,
      // MuAvatar,
      // MuDivider,
      // MuIcon,
      // MuDialog,
      // MuSelectField,
      avatar1,
      // MuSubHeader
    },
    data() {
      const list = []
      for (let i = 0; i < 30; i++) {
        list.push(`item ${i + 1}`)
      }
      return {
        loaded:false,
        dialog:false,
        carId:'',
        carCode:'',
        carEngine:'',
        carIdError:'',
        carCodeError:'',
        carEngineError:'',  
        popupOpened:false,
        showError:false,
        errorMessage:'',
        hasFocus:false,
        list,
        avatar1,
      }
    },
    computed:{
      carCodeNeededLength(){
          if(this.selectedProvince && this.selectedCity){
            return this.address[this.selectedProvince].cities[this.selectedCity].carCodeNeededLength            
          }
        },
        carEngineNeededLength(){
          if(this.selectedProvince && this.selectedCity){
            return this.address[this.selectedProvince].cities[this.selectedCity].carEngineNeededLength            
          }
        },
        carCodeLabel(){
          return '车架号'+ (!this.carCodeNeededLength ? '（选填）': '')
        },
        carCodeHintText(){
          if(!!this.carCodeNeededLength && this.carCodeNeededLength!==Infinity){
            return '请输入车架号后'+this.carCodeNeededLength+'位'
          }else{
            return '请输入车架号'
          }
          // return validate.carCodeInvalidMessage('',Infinity)
        },
        carEngineLabel(){
        return '发动机号'+ (!this.carEngineNeededLength ? '（选填）': '')
        },
        carEngineHintText(){
          if(!!this.carEngineNeededLength && this.carEngineNeededLength!==Infinity){
            return '请输入发动机号后'+this.carEngineNeededLength+'位'
          }else{
            return '请输入发动机号'
          }
          // return validate.carEngineInvalidMessage('',Infinity)
      }
    },
    created(){
    },
    methods: {
      carIdIsInvalid(){
        return this.carIdError=validate.carIdInvalidMessage(this.carId)
      },
      carCodeIsInvalid(){
        return this.carCodeError=validate.carCodeInvalidMessage(this.carCode,this.carCodeNeededLength)
      },
      carEngineIsInvalid(){
        return this.carEngineError=validate.carEngineInvalidMessage(this.carEngine,this.carEngineNeededLength)
      },
      submit(){
        if(!this.addressIsInvalid() && !this.carIdIsInvalid() && !this.carCodeIsInvalid() && !this.carEngineIsInvalid()){
          this.$router.push({name:'car-add',query:{
              carId:this.carId,
              carCode:this.carCode,
              carEngine:this.carEngine,
              carCodeNeededLength:this.carCodeNeededLength,
              carEngineNeededLength:this.carEngineNeededLength
            }
          })
        }else{
          console.log('invalid input value')
        }
      },
      open(){
        this.dialog = true
      },
      close(){
        this.dialog = false
      },
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #car-information{
  .mu-text-field{
    padding:0 $spaceSmall;
    margin-bottom:0;
    background:$colorWhite;
      &.has-label .mu-text-field-label.float{
        color:$colorDark;
      }
      &.focus-state{
        color:$colorSecondary;
      }
      .mu-text-field-help{
        padding:0 $spaceSmall;
      }
      .mu-text-field-content{
        padding-bottom:18px
      }
      .mu-text-field-focus-line{
        background-color:$colorSecondary;
      }       
    }
    .mu-text-field-hint{
      color:$colorDark;
    }
    .mu-text-field.false-input.focus-state .mu-text-field-focus-line{
        transform:scaleX(1);
    }
  .listBg{
    background:$colorWhite;
  }
  .mu-list{
    padding:0
  }
  .delete{
    display:block;
    max-width:95%;
    margin:0 auto;
    margin-top:1rem;
  &.mu-raised-button-secondary{
     background-color:$colorRed;
   }
  }

  }
</style>

