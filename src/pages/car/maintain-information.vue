<template>
	<section id="maintain-information" class="bg">
    <!-- <appbar :link="{name:'car-add',query:{id:this.$route.query.id,hasMatInfo:this.$route.query.hasMatInfo}}"/> -->
    <magic-header titleName="保养信息"></magic-header>
      <mu-text-field hintText="车辆里程(km)" v-model="carDrivingRange" :errorText="carDrivingRangeText"  @blur="drivingRangeError" fullWidth/><br/>
      <mu-list>
        <mu-list-item title="" afterText="车辆里程为设备初始记录里程">
        </mu-list-item>
      </mu-list>
      <mu-date-picker hintText="保养日期" :shouldDisableDate="shouldDisable" v-model="happenDate"  fullWidth/> <br/>
      <mu-text-field hintText="上次保养里程(km)" v-model="drivingRange" :errorText="drivingRangeText"  @blur="drivingRangeError" fullWidth/><br/>
      <mu-dropDown-menu :value="value" @change="handleChange" autoWidth>
        <mu-menu-item value="0" title="请选择"/>
        <mu-menu-item value="5000" title="5000"/>
        <mu-menu-item value="7500" title="7500"/>
        <mu-menu-item value="10000" title="10000"/>
        <mu-menu-item value="12000" title="12000"/>
        <mu-menu-item value="15000" title="15000"/>
      </mu-dropDown-menu>
      <mu-list>
        <mu-list-item title="" afterText="完善保养信息可以获得保养提醒服务">
        </mu-list-item>
      </mu-list>
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
  // import MuDatePicker from 'muse-components/datePicker'
  // import MuSelectField from 'muse-components/selectField'
  // import MuDropDownMenu from 'muse-components/dropDownMenu'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import {menu as MuMenu,menuItem as MuMenuItem} from 'muse-components/menu'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import isEmpty from 'utilities/is-empty'
  // import isInteger from 'utilities/is-integer'
  import editMaintain from 'services/editMaintain-information'
  import carBasicInfo from 'services/car-basic-info'
  import maintainInformation from 'services/maintain-information'
  // import ContentWithLoading from 'components/content-with-loading'
  export default {
    components: {
      magicHeader
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
      // MuDropDownMenu,
      // MuDatePicker,
      // MuSelectField
    },
    data() {
      return {
        value: '0',
        loaded:false,
        hasMatInfo:false,
        id:'',
        name:'',
        plateNumber:'',
        brand:'',
        series:'',
        type:'',
        vin:'',
        selectData:'',
        plateNumberType:'',
        engineNumber:'',
        nowDrivingRange:'',
        happenDate:'',
        drivingRange:'',
        drivingRangeGap:[5000,7500,10000,12000,15000],
        carDrivingRangeText:'',
        drivingRangeText:'',
      }
    },
    computed:{

    },
    created(){
    },
    watch:{
      '$route':function(to,from){
        if(from.name==='maintain-information'){
            this.initData()
        }
      }
    },
    methods: {
      shouldDisable (date) {
        return date > new Date()
      },
      handleChange (value) {
        this.value = value
      },
      initData(){
        editMaintain.bind(this)({
              carId:this.$route.query.id,
              type:1
            },(data)=>{
              this.carDrivingRange=data.car.drivingRange
              this.happenDate=data.carMaintain.happenDate
              this.drivingRange=data.carMaintain.drivingRange
              this.value=data.carMaintain.drivingRangeGap
            },(error)=>{
              this.message=error
              this.showMessage=true
            })
      },
      carDrivingRangeError(){       
        if(!this.$.isEmpty(this.carDrivingRange)&&isNaN(this.carDrivingRange)){
          this.carDrivingRangeText='请输入数字'
        }else{
          this.carDrivingRangeText=''
        }
      },
      drivingRangeError(){
        if(!this.$.isEmpty(this.isInteger)&&isNaN(this.drivingRange)){
          this.drivingRangeText='请输入数字'
        }else{
          this.drivingRangeText=''
        }
      },
    	submit(){
        var carDrivingRange=this.carDrivingRange,
            happenDate=this.happenDate,
            drivingRange=this.drivingRange,
            drivingRangeGap=this.value,
            id =this.$route.query.id
        console.log(this.carDrivingRange);
        console.log(!this.$.isEmpty(this.carDrivingRange));
        console.log(isNaN(this.carDrivingRange));    
        if(!this.$.isEmpty(this.drivingRange)&&isNaN(this.drivingRange)){
          this.drivingRangeText='请输入数字'
          return
        }
        if(!this.$.isEmpty(this.carDrivingRange)&&isNaN(this.carDrivingRange)){
          this.carDrivingRangeText= '请输入数字'
          return
        }   
        if(!this.$.isEmpty(this.carDrivingRange)||!this.$.isEmpty(this.happenDate)||!this.$.isEmpty(this.drivingRange)||!this.$.isEmpty(this.value)){
          carBasicInfo.get.bind(this)({
              id:id
          },(data)=>{
              maintainInformation.bind(this)({car:({
                id,
                plateNumber:data.carId,
                vin:data.carCode,
                engineNumber:data.carEngine,
                brand:data.brand,
                series:data.series,
                type:data.type,
                isSpecialCarId:data.isSpecialCarId ? 1 : 0,
                drivingRange:carDrivingRange
                }),carMaintain:({
                happenDate,
                drivingRange,
                drivingRangeGap,
                carId:id,
            })},(car)=>{
                    console.log(car)
                    this.$router.push({name:'car-add',query:{
                    id:car.id,
                    hasMatInfo:true
                     }})
                  },(errorMessage)=>{
                    this.errorMessage=errorMessage
                    this.showError=true
                  })
            },(errorMessage)=>{
              this.errorMessage=errorMessage
              this.showError=true
            })
          }
        },
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #maintain-information{
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
        .mu-text-field-focus-line{
          background-color:$colorSecondary;
        }

      }
      .mu-text-field.false-input.focus-state .mu-text-field-focus-line{
          transform:scaleX(1);
      }
  .mu-dropDown-menu{
    width:100%;
    .mu-dropDown-menu-line{
      margin:0;
    }
    .mu-dropDown-menu-text{
      padding-left:16px;
    }
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
     background-color:#c60007;
   }
  }

  }
</style>
