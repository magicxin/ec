<template>
	<section id="car-add" class="bg">
    <!-- <appbar :link="{name:'car-list'}"/>  -->
    <magic-header titleName="添加车辆"></magic-header>
      <!-- <content-with-loading :loaded="loaded"> -->
        <mu-raised-button v-if="!$route.query.id" label="+ 添加好友车辆" class="add-friend-car" @click="addFriendCar" fullWidth/>
        </mu-raised-button>
        <mu-list class="listBg" id="listHeader">
    	    <mu-list-item :title="carId ? carId : '请填写基本信息'" :afterText="carId ? '' : '*必填项'" @click="carInformation">
    	      <mu-avatar :src="carLogo || favicon" slot="leftAvatar"/>
            <p style="color:rgba(0,0,0,0.5);" v-if="carId">{{carBrand}}</p>
    	      <mu-icon value="keyboard_arrow_right" slot="right"/>
    	    </mu-list-item>
    	  </mu-list>
	      <mu-divider class="headDivider"/>
	      <mu-list class="listBg">
    	    <mu-list-item title="绑定设备" :afterText="hasBindedDevice ? '已绑定' : '未绑定'"  @click="bindDevice">
    	      <mu-icon value="keyboard_arrow_right" slot="right"/>
    	    </mu-list-item>
    	    <mu-divider/>
          <div v-if="hasMatInfo">
            <mu-list-item title="保养信息" afterText="已填写" @click="maintainInformation">
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
          </div> 
          <div v-else>
            <mu-list-item title="保养信息" afterText="未填写" @click="maintainInformation">
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
          </div>
    	    <mu-divider/>
          <div v-if="hasInsInfo">
      	    <mu-list-item title="保险信息" afterText="已填写"  @click="insuranceInformation">
      	      <mu-icon value="keyboard_arrow_right" slot="right"/>
      	    </mu-list-item>
          </div> 
          <div v-else>
            <mu-list-item title="保险信息" afterText="未填写"  @click="insuranceInformation">
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
          </div>
    	    <mu-divider/>
          <div v-if="hasAuditInfo">
      	    <mu-list-item title="年检信息"  afterText="已填写" @click="motInformation">
      	      <mu-icon value="keyboard_arrow_right" slot="right"/>
      	    </mu-list-item>
          </div>
          
          <div v-else>
            <mu-list-item title="年检信息"  afterText="未填写" @click="motInformation">
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
          </div>
          <mu-divider/>

  	  </mu-list> 	
      <p style="color:rgba(0,0,0,0.4);text-align:right;padding-right:1rem;">完善以上信息可以获得更多增值服务</p>	
<!--   	  <mu-list>
    		<mu-list-item afterText="完善以上信息可以获得更多增值服务">
  	    </mu-list-item>

  	  </mu-list>
 -->  <section :class="['set-default-car',isDefaultCar ? 'default-setted' : '']" v-if="id && showSetDefault">
        <mu-switch label="设置为默认车辆" @change="toggleDefaultCar"/>        
      </section>
      <mu-raised-button v-if="id" label="删除车辆" class="delete-car" @click="deleteCar" primary fullWidth/>     
      <div> 
        <mu-snackbar class="center" v-if="snackbar" :message="errorMessage || '请先填写基本信息'" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
      </div>
    <!-- </content-with-loading>   -->
  </section>
</template>
<script>
  // import MuSwitch from 'muse-components/switch'
  // import MuSnackbar from 'muse-components/snackbar'
  // import MuAppbar from 'muse-components/appbar'
  // import MuFlatButton from 'muse-components/flatButton'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuPicker from 'muse-components/picker'
  // import MuAvatar from 'muse-components/avatar'
  // import MuDivider from 'muse-components/divider'
  // import MuToast from 'muse-components/toast'
  // import MuIcon from 'muse-components/icon'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import isEmpty from 'utilities/is-empty'  
  // import ContentWithLoading from 'components/content-with-loading'
  import favicon from 'assets/favicon.png'
  import deleteCar from 'services/binded-car-delete'
  import carData from 'services/car-basic-info'
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
      // MuRaisedButton,
      // MuPicker,
      // MuAvatar,
      // MuDivider,
      // MuIcon,
      // MuToast,
      // MuSwitch,
      favicon,
    },
    data() {
      return {
        loaded:false,
        hasAuditInfo:false,
        hasInsInfo:false,
        hasMatInfo:false,
        hasBindedDevice:false,
        snackbar: false,
        onTime:'',
        carId:'',
        id:'',
        errorMessage:'',
        carLogo:'',
        carBrand:'',
        isDefaultCar:false,
        showSetDefault:false,
        carDataCache:'',
      	favicon
      }
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='car-add'){
            this.getUrl()
        }
      }
    },
    created(){
      this.getUrl()
    },
    methods: {
      getUrl(){
        this.loaded=false
        this.id=this.$route.query.id || ''
        this.carId=''
          this.carDataCache=''
          this.carBrand=''
          this.carLogo=''
          this.hasAuditInfo=false
          this.hasInsInfo=false
          this.hasMatInfo=false
          this.hasBindedDevice=false
          this.isDefaultCar=false
          this.showSetDefault=false
          this.errorMessage=''
          this.snakebar=false

        if(!!this.id){
          carData.get.bind(this)({id:this.id},(data)=>{
            console.log(data)
            this.carDataCache=data
            this.carId=data.carId
            this.carBrand=data.type
            this.carLogo=data.carLogo
            this.hasAuditInfo=data.yearCheckFilled
            this.hasInsInfo=data.insuranceFilled
            this.hasMatInfo=data.maintainFilled
            this.hasBindedDevice=data.hasBindedDevice
            this.isDefaultCar=data.isDefaultCar
            this.showSetDefault=!data.isDefaultCar
            this.loaded=true
          },(err)=>{
            this.errorMessage=err
            this.snackbar=true
            this.loaded=true
          })          
        }else{

          this.loaded=true
        }
        // if(this.$route.query.hasAuditInfo){
        //     console.log(this.$route.query.hasAuditInfo)
        //     this.hasAuditInfo=true
        // }
        // if(this.$route.query.hasInsInfo){
        //     console.log(this.$route.query.hasInsInfo)
        //     this.hasInsInfo=true
        // }
        // if(this.$route.query.hasMatInfo){
        //     console.log(this.$route.query.hasMatInfo)
        //     this.hasMatInfo=true
        // }

      },
      addFriendCar(){
        this.$router.push({name:'add-friend-car'})
      },
	    bindDevice(){
      if(!this.$.isEmpty (this.$route.query.id)){
        this.$router.push({name:'bind-device',query:{
          id:this.$route.query.id
        }})
        }else{
          this.showSnackbar()
        }
	    },
      carInformation(){
      this.$router.push({name:'car-edit-basic-info',query:{
        id:this.$route.query.id
      }})
      },
      maintainInformation(){
        if(!this.$.isEmpty (this.$route.query.id)){
          this.$router.push({name:'maintain-information',query:{
                id:this.$route.query.id,
                hasMatInfo:this.$route.query.hasMatInfo   
            }})
        }else{
          this.showSnackbar()
        }  
      },
      insuranceInformation(){
        if(!this.$.isEmpty (this.$route.query.id)){
          this.$router.push({name:'insurance-information',query:{
              id :this.$route.query.id, 
              hasInsInfo:this.$route.query.hasInsInfo          
          }}) 
        }else{
          this.showSnackbar()
        }
      },           
      motInformation(){
        if(!this.$.isEmpty (this.$route.query.id)){  
          this.$router.push({name:'mot-information',query:{
              onTime:this.$route.query.onTime, 
              id :this.$route.query.id, 
              hasAuditInfo:this.$route.query.hasAuditInfo          
          }})
        }else{
          this.showSnackbar()
        }          
      },
      showSnackbar() {
        this.snackbar = true
        if (this.snackTimer) clearTimeout(this.snackTimer)
        this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000)
      },
      hideSnackbar() {
        this.snackbar = false
        if (this.snackTimer) clearTimeout(this.snackTimer)
      },
      deleteCar(){
        deleteCar.bind(this)({id:this.id},(data)=>{
          this.$router.push({name:'car-map',query:{refresh:true}})
        },(err)=>{
          this.errorMessage=err
          this.snackbar=true
        })
      },
      toggleDefaultCar(value){
          this.isDefaultCar=value
          this.carDataCache.isDefaultCar=value
          carData.edit.bind(this)(this.carDataCache,(data)=>{
            this.showSetDefault=false
          },(err)=>{
            this.isDefaultCar=!this.isDefaultCar
            this.errorMessage=err
            this.snackbar=true
          })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #car-add{
    .add-friend-car{
      width:100%;
      margin:0;
      background-color:rgba(0, 0, 0, 0.12);
      .mu-raised-button-label{
        width:100%;
        text-align:right;
        color:$colorSecondary;
        padding-right:$spaceMedium*1.2;
      }
    }
    .set-default-car{
      padding:$spaceSmall;
      .mu-switch-label{
        color:rgba(0,0,0,0.4);
      }
      &.default-setted{
        .mu-switch-label{
          color:$colorSecondary;
        }
      }
    }
  .input-wrapper{
    padding-top:$spaceMedium;
  .mu-text-field{
    padding:0 $spaceSmall;
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
  }
  .listBg{
  	background:#fff
  }
  #listHeader .mu-item-after{
  	color:#f98700
  }
  .headDivider{
  	height:10px
  }
  .delete-car{
    display:block;
    max-width:95%;
    margin:0 auto;
    margin-top:$spaceSmall;
  &.mu-raised-button-secondary{
     background-color:$colorSecondary;
   }
  }

  }
</style>

