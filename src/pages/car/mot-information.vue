<template>
	<section id="mot-information" class="bg">
    <!-- <content-with-loading :loaded="loaded"> -->
      <!-- <appbar :link="{name:'car-add',query:{id:this.$route.query.id,hasAuditInfo:this.$route.query.hasAuditInfo}}"/>      -->
        <magic-header titleName="年检信息"></magic-header>
        <mu-date-picker hintText="上牌日期" v-model="onTime" fullWidth/> <br/>
        <mu-list>
          <mu-list-item title="" afterText="完善年检信息可以获得年检提醒服务">
          </mu-list-item>
        </mu-list>
         <mu-raised-button label="保存信息" class="delete" @click="submit" secondary fullWidth/>
    <!-- </content-with-loading>      -->
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import MuAppbar from 'muse-components/appbar'
  // import MuFlatButton from 'muse-components/flatButton'
  // import MuPopup from 'muse-components/popup'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuPicker from 'muse-components/picker'
  // import MuDatePicker from 'muse-components/datePicker'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import isEmpty from 'utilities/is-empty'
  import motInformation from 'services/mot-information'
  import carBasicInfo from 'services/car-basic-info'
  // import ContentWithLoading from 'components/content-with-loading'
  import avatar1 from 'assets/avatar1.jpg'
  export default {
    components: {
      magicHeader,
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuSnackbar,
      // MuAppbar,
      // MuFlatButton,
      // MuPopup,
      // MuRaisedButton,
      // MuPicker,
      // MuDatePicker,
    },
    data() {
      return {
        loaded:false,
        hasAuditInfo:false,
        carId:'',
        avatar1,
        id:'',
        carId:'',
        isSpecialCarId:false,
        selectedBrand:[],
        carCode:'',
        carEngine:'',
        carIdError:'',
        carCodeError:'',
        carEngineError:'',
        onTime:'',
      }
    },
    computed:{
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='mot-information'){
            this.initData()
        }
      },
    },
    created(){   
      this.loaded=true, 
      this.onTime= this.$route.query.onTime,
      this.hasAuditInfo= this.$route.query.hasAuditInfo,
      this.initData()
    },
    methods: {
      initData(){
        carBasicInfo.get.bind(this)({
              id:this.$route.query.id, 
            },(data)=>{
              this.onTime=data.onTime
            },(error)=>{
              this.message=error
              this.showMessage=true
            }) 
      },
    	submit(){   
        var id =this.$route.query.id,  
        onTime=this.onTime 
        if(!this.$.isEmpty(id)){ 
          carBasicInfo.get.bind(this)({
              id:id
          },(data)=>{                 
              motInformation.bind(this)({car:({
                onTime,
                id,
                plateNumber:data.carId,
                vin:data.carCode,
                engineNumber:data.carEngine,
                brand:data.brand,
                series:data.series,
                type:data.type,
                isSpecialCarId:data.isSpecialCarId ? 1 : 0,
                })},(car)=>{
                    console.log(car)  
                    this.$router.push({name:'car-add',query:{
                    onTime:this.onTime, 
                    id:id,  
                    hasAuditInfo:true    
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
  #mot-information{
  .mu-text-field{
    padding:0 $spaceSmall;
    margin-bottom:0;
    background:$colorWhite;
  }
  .mu-text-field-hint{
    color:$colorDark
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

