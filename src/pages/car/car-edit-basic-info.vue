<template>
  <section id="car-edit-basic-info">
    <!-- <appbar :link="{name:'car-add',query:{hasBasicInfo:basicInfoSaved,id:id}}"/> -->
    <magic-header titleName="基本信息"></magic-header>
    <!-- <content-with-loading :loaded="loaded"> -->
        <section class="car-id-input">
          <mu-raised-button :label="provinceText" class="province" @click="open('bottom')"/>
          <mu-switch label="特殊牌照" v-model="isSpecialCarId"/>

          <mu-text-field class="add-margin" label="车牌号" :hintText="isSpecialCarId ? '请输入6至12位特殊车牌号': '请输入7位车牌号'" :errorText="carIdError" v-model="carId" @focus="carIdError=''" @blur="carIdIsInvalid" labelFloat fullWidth/>
        </section>
        <mu-text-field label="车架号(选填)" hintText="请输入车架号" :errorText="carCodeError" v-model="carCode" @focus="carCodeError=''" @blur="carCodeIsInvalid" labelFloat fullWidth/>
        <mu-text-field label="发动机号(选填)" hintText="请输入发动机号" :errorText="carEngineError" v-model="carEngine" @focus="carEngineError=''" @blur="carEngineIsInvalid" labelFloat fullWidth/>
        <mu-list>
          <mu-divider/>
            <mu-list-item :title="selectedBrand.length ? '已选车型 '+selectedBrand.join(' '): '选择车型'" @click="menuOpen">
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
          <mu-divider/>
        </mu-list>
        <mu-raised-button label="保存" class="submit" @click="submit" secondary fullWidth/>
    <!-- </content-with-loading> -->
    <!-- <transition name="slide-left"> -->
      <cascaded-menu :lists="cascadedMenu" :listTitles="menuTitles" @menu-active="menuActive" @menu-close="menuClose"/>
    <!-- </transition> -->
      <mu-snackbar class="center" v-if="showMessage" :message="message" action="关闭" @actionClick="closeMessage" @close="closeMessage"/>



    <mu-popup position="bottom" popupClass="demo-popup-bottom" :open="bottomPopup" @close="close('bottom')">
      <div class="province-items">
        <span @click="selectProvince(item.province),close('bottom')" class="province-item" v-for="item in items">
          {{item.province}}

        </span>
      </div>
    </mu-popup>


    <!-- <content-with-loading :loaded="!isPosting"/> -->
  </section>
</template>

<script>
// import MuSnackbar from 'muse-components/snackbar'
// import Appbar from 'components/appbar'
import magicHeader from 'components/magicHeader'
// import ContentWithLoading from 'components/content-with-loading'
// import MuTextField from 'muse-components/textField'
// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
// import MuRaisedButton from 'muse-components/raisedButton'
// import MuDivider from 'muse-components/divider'
// import MuIcon from 'muse-components/icon'
// import MuSwitch from 'muse-components/switch'
import CascadedMenu from 'components/cascaded-menu-h5'
import carBasicInfo from 'services/car-basic-info'
import validate from 'utilities/validate-car-info'
import carBrandsInfo from 'services/car-brands-info'
// import isInteger from 'utilities/is-integer'
// import MuPopup from 'muse-components/popup'
  export default {
    components:{
      magicHeader,
      // MuSnackbar,
      // Appbar,
      // ContentWithLoading,
      // MuTextField,
      // MuList,
      // MuRaisedButton,
      // MuListItem,
      // MuSwitch,
      // MuIcon,
      // MuDivider,
      CascadedMenu,
      // MuPopup
    },
    data(){
      return {
        bottomPopup: false,
        loaded:false,
        id:'',
        carId:'',
        isSpecialCarId:false,
        carCode:'',
        carEngine:'',
        carIdError:'',
        carCodeError:'',
        carEngineError:'',
        message:'',
        showMessage:false,
        isPosting:false,

        cascadedMenu:[],
        menuTitles:['选择品牌','选择车系','选择车型'],
        selectedBrand:[],
        provinceText:'吉',
        items: [
          {province: '京' },
          {province: '沪' },
          {province: '浙' },
          {province: '苏' },
          {province: '粤' },
          {province: '鲁' },
          {province: '晋' },
          {province: '冀' },
          {province: '豫' },
          {province: '川' },
          {province: '渝' },
          {province: '辽' },
          {province: '吉' },
          {province: '黑' },
          {province: '皖' },
          {province: '鄂' },
          {province: '湘' },
          {province: '赣' },
          {province: '闽' },
          {province: '陕' },
          {province: '甘' },
          {province: '宁' },
          {province: '蒙' },
          {province: '津' },
          {province: '贵' },
          {province: '云' },
          {province: '桂' },
          {province: '琼' },
          {province: '青' },
          {province: '藏' },
          {province: '新' }
        ]
      }
    },
    computed:{
      basicInfoSaved(){
        return !!this.id
      }
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='car-edit-basic-info'){
            this.initData()
        }
      },
      isSpecialCarId:function(){
        this.carIdIsInvalid()
      }
    },
    created(){
      this.initData()
    },
    methods:{
      open (position) {
        this[position + 'Popup'] = true
      },
      close (position) {
        this[position + 'Popup'] = false
      },
      selectProvince (province) {
        this.provinceText = province
      },
      initData(){
        function clearData(){
          this.loaded=false
          this.isSpecialCarId=false
          this.id=''
          this.carId=''
          this.carCode=''
          this.carEngine=''
          this.carIdError=''
          this.carCodeError=''
          this.carEngineError=''
          this.message=''
          this.selectedBrand=[]
          this.showMessage=false
          this.isPosting=false
        }
        if(this.$route.query.id){
          if(this.id!=this.$route.query.id){
            clearData.bind(this)()
            this.id=this.$route.query.id
            carBasicInfo.get.bind(this)({
              id:this.id
            },(data)=>{
              console.log(data)
              this.provinceText = data.carId?data.carId.substring(0,1):'';
              this.carId=(data.carId&&data.carId.length>2)?data.carId.substring(1,data.carId.length):'';
              this.carCode=data.carCode
              this.carEngine=data.carEngine
              this.selectedBrand=[data.brand,data.series,data.type]
              this.isSpecialCarId=data.isSpecialCarId
              this.loaded=true
            },(error)=>{
              this.message=error
              this.showMessage=true
            })
          }
        }else{
          clearData.bind(this)()
          this.loaded=true
        }
      },
      carIdIsInvalid(){
        if(this.isSpecialCarId){
          return this.carIdError=validate.specialCarIdInvalidMessage(this.provinceText + this.carId)
        }else{
          return this.carIdError=validate.carIdInvalidMessage(this.provinceText + this.carId)
        }
      },
      carCodeIsInvalid(){
        if(this.carCode){
          return this.carCodeError=validate.carCodeInvalidMessage(this.carCode,17,true)
        }else{
          return this.carCodeError=''
        }
      },
      carEngineIsInvalid(){
        if(this.carEngine){
          return this.carEngineError=validate.carEngineInvalidMessage(this.carEngine,6,true)
        }else{
          return this.carEngineError=''
        }
      },
      fillBrandMenuData(level,item){
          this.cascadedMenu.splice(level,1,[])
          carBrandsInfo.bind(this)({level:level,item:item},(data)=>{
            if(data && data.length){
              setTimeout(()=>{
                this.cascadedMenu.splice(level,1,data)
              },500)
            }else{
              this.menuClose()
            }
          },(error)=>{

          })
      },
      menuOpen(){
        this.fillBrandMenuData(0)
      },
      menuActive(listIndex,itemIndex,list,item){
          this.selectedBrand.splice(listIndex,1,item.text)
          this.selectedBrand.splice(listIndex+1)
          if(listIndex===2){
            return this.menuClose()
          }
          this.fillBrandMenuData(listIndex+1,item)
      },
      menuClose(listIndex,list){
          if(isInteger(listIndex)){
            this.cascadedMenu.splice(listIndex,1)
          }else{
            this.cascadedMenu=[]
          }
      },
      closeMessage(){
        this.showMessage=false
        this.isPosting=false
      },
      submit(){
        if(!this.carIdIsInvalid() && !this.carCodeIsInvalid() && !this.carEngineIsInvalid()){
          console.log('valid')
          let params={
            carId:this.provinceText + this.carId.toUpperCase(),
            carCode:this.carCode,
            isSpecialCarId:this.isSpecialCarId,
            carEngine:this.carEngine,
            brand:this.selectedBrand[0],
            series:this.selectedBrand[1],
            type:this.selectedBrand[2]
          }
          this.id && (params.id=this.id)
          let postFunc=this.id ? carBasicInfo.edit.bind(this) : carBasicInfo.add.bind(this)
          this.isPosting=true
          postFunc(params,(data)=>{
            this.id=data.id
            this.isPosting=false
            this.$router.push({name:'car-add',query:{id:this.id,hasBasicInfo:this.basicInfoSaved}})
          },(error)=>{
            this.message=error
            this.showMessage=true
            this.isPosting=false
          })
        }else{
          console.log('invalid')
        }
      }

    }
  }
</script>

<style lang="scss">
@import "../../scss/variables.scss";
  #car-edit-basic-info{
    position:relative;
    .add-margin{
      margin-top:$spaceSmall*2;
      input{
      text-transform:uppercase;
      }
    }
    .car-id-input{
      position:relative;
      .mu-switch{
        font-size:12px;
        position:absolute;
        right:$spaceSmall;
        bottom:$spaceSmall*2;
        z-index:1;
        .mu-switch-label{
          color:lighten($colorLight,50%);
        }
      }
    }
    >  .content-wrapper> .mu-list{ //.content-with-loading
      margin-top:$spaceSmall*3;
      .mu-item-title{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }
    .mu-item-wrapper{
      background-color:$backgroudLight;
    }
  }

  #car-edit-basic-info .car-id-input .province {
    background: #fff;
    border: #fa9015 solid 1px;
    box-shadow: none;
    position: absolute;
    bottom:2.3rem;
    left:0;
    height:2rem;
    font-size: 1.5rem;
    width: 3rem !important;
    min-width: 3rem;
    margin-left: 1rem;
    padding-right: 1.3rem;
    z-index: 1;
    color: #fa9015;

  }
  #car-edit-basic-info .car-id-input .province .mu-raised-button-wrapper {
    position: absolute;
    top:0;
    left: 0;
    width: 80%;
  }

  #car-edit-basic-info .car-id-input .province:after {
    content: ' ';
    border: .4rem solid #fff;
    border-top-color: #fa9015;
    width: 0;
    height: 0;
    display: block;
    float: right;
    width: 20%;
    position: absolute;
    top:.7rem;
    right: .25rem;
  }
  #car-edit-basic-info .car-id-input .mu-text-field {
    padding-left:5rem;
  }
  .province-items {
    padding: .7rem;

  }
  .province-item {
    border-radius: 5px;
    border:#999 solid 1px;
    width: 2.7rem;
    height:2.8rem;
    line-height: 2.8rem;
    display:inline-block;
    color: #333;
    margin: .3rem;
    text-align: center;
  }

</style>
