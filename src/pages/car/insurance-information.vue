<template>
	<section id="insurance-information" class="bg">
    <!-- <content-with-loading :loaded="loaded"> -->
      <!-- <appbar :link="{name:'car-add',query:{id:this.$route.query.id,hasInsInfo:this.$route.query.hasInsInfo}}"/> -->
      <magic-header titleName="保险信息"></magic-header>
        <mu-text-field hintText="请选择保险公司"  v-model="name" @focus="company" fullWidth/><br/>
        <mu-date-picker hintText="上次投保日期" :shouldDisableDate="shouldDisable" v-model="policyEffectiveDate" fullWidth/> <br/>
        <mu-list>
          <mu-list-item title="" afterText="完善保险信息可以获得保险提醒服务">
          </mu-list-item>
        </mu-list>
         <mu-raised-button label="保存信息" class="delete" @click="submit" secondary fullWidth/>
    <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import MuAppbar from 'muse-components/appbar'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuTextField from 'muse-components/textField'
  // import MuDatePicker from 'muse-components/datePicker'
  // import MuSelectField from 'muse-components/selectField'
  // import {menu as MuMenu,menuItem as MuMenuItem} from 'muse-components/menu'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import isEmpty from 'utilities/is-empty'
  import carBasicInfo from 'services/car-basic-info'
  // import ContentWithLoading from 'components/content-with-loading'
  import insuranceInformation from 'services/insurance-information'
  import editInsurance from 'services/editInsurance-information'
  export default {
    components: {
      magicHeader
      // Appbar,
      // ContentWithLoading,
      // MuSnackbar,
      // MuAppbar,
      // MuRaisedButton,
      // MuMenu,
      // MuMenuItem,
      // MuList,
      // MuListItem,
      // MuDatePicker,
      // MuTextField,
      // MuSelectField,
    },
    data() {
      return {
        loaded:true,
        hasInsInfo:false,
        id:'',
        name:'',
        plateNumber:'',
        brand:'',
        series:'',
        type:'',
        vin:'',
        plateNumberType:'',
        engineNumber:'',
        insurances:[],
        policyEffectiveDate:''
      }
    },
    computed:{

    },
    created(){
    },
    watch:{
      '$route':function(to,from){
        console.log(to)
        console.log(from)
        if(from.name==='insurance-information'){
            this.initData()
        }
        if(from.name==='insurance-company'){
          this.getData()
        }
      }
    },
    methods: {
      shouldDisable (date) {
        return date > new Date()
      },
      initData(){
        editInsurance.bind(this)({
              carId:this.$route.query.id,
              type:1
            },(data)=>{
              console.log(data)
              this.name=data.insuranceCompany
              this.policyEffectiveDate=data.policyEffectiveDate
            },(error)=>{
              this.message=error
              this.showMessage=true
            })
      },
      getData(){
          this.name=this.$route.query.companyName
          console.log(this.name)
      },
      submit(){
        var insuranceCompany=this.name,
            policyEffectiveDate=this.policyEffectiveDate,
            id =this.$route.query.id
        if(!this.$.isEmpty(this.policyEffectiveDate)||!this.$.isEmpty(this.name)){
          carBasicInfo.get.bind(this)({
              id:id
          },(data)=>{
              insuranceInformation.bind(this)({car:({
                id,
                plateNumber:data.carId,
                vin:data.carCode,
                engineNumber:data.carEngine,
                brand:data.brand,
                series:data.series,
                type:data.type,
                isSpecialCarId:data.isSpecialCarId ? 1 : 0,
                }),carInsurance:({
                insuranceCompany,
                policyEffectiveDate,
                carId:id,
            })},(car)=>{
                    console.log(car)
                    this.$router.push({name:'car-add',query:{
                    id:car.id,
                    hasInsInfo:true
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
      company(){
        this.$router.push({name:'insurance-company',query:{
          id:this.$route.query.id
        }})
      }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #insurance-information{
  .listBg{
  	background:#ffffff;
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
