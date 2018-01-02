<template>
	<section id="add-friend-car">
		<!-- <appbar :link="{name:'car-add'}"/> -->
		<magic-header titleName="添加好友车辆"></magic-header>
		<!-- <content-with-loading :loaded="loaded"> -->
			<section class="car-id-input">
	          <mu-switch label="特殊牌照" v-model="isSpecialCarId"/>
	          <mu-text-field class="add-margin" label="车牌号" :hintText="isSpecialCarId ? '请输入6至12位特殊车牌号': '请输入7位车牌号（如：吉AUN110）'" :errorText="carIdError" v-model="carId" @focus="carIdError=''" @blur="carIdIsInvalid" labelFloat fullWidth/>          
	        </section>	
        <mu-raised-button label="发送请求" class="submit" @click="submit" secondary fullWidth/>     

		<!-- </content-with-loading> -->
	<mu-snackbar class="center" v-if="!!message" :message="message" action="关闭" @actionClick="closeMessage" @close="closeMessage"/>
    <!-- <content-with-loading :loaded="!isPosting"/> -->

	</section>
</template>

<script>
// import Appbar from 'components/appbar'
import magicHeader from 'components/magicHeader'
// import ContentWithLoading from 'components/content-with-loading'
// import MuSwitch from 'muse-components/switch'
// import MuTextField from 'muse-components/textField'
// import MuRaisedButton from 'muse-components/raisedButton'
// import MuSnackbar from 'muse-components/snackbar'
import validate from 'utilities/validate-car-info'
import carBasicInfo from 'services/car-basic-info'


	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// MuSwitch,
			// MuTextField,
			// MuSnackbar,
			// MuRaisedButton
		},
		data(){
			return {
				loaded:true,
				isSpecialCarId:false,
				carId:'',
				carIdError:'',
				message:'',
				isPosting:false
			}
		},
		// watch:{
		//  '$route':function(to,from){
		//  	if(to.name=='add-friend-car'){
		//  		this.carId=''
		//  	}
		//  },
	  //     isSpecialCarId:function(){
	  //       this.carIdIsInvalid()
	  //     }
	  //   },
		methods:{
			closeMessage(){
				this.message=''
			},
			carIdIsInvalid(){
		        if(this.isSpecialCarId){
		          return this.carIdError=validate.specialCarIdInvalidMessage(this.carId)            
		        }else{
		          return this.carIdError=validate.carIdInvalidMessage(this.carId)          
		        }
			},
			  submit(){
		        if(!this.carIdIsInvalid()){
		          console.log('valid')
		          let params={
		            carId:this.carId.toUpperCase(),
		            isSpecialCarId:this.isSpecialCarId,
		            isFriendCar:true 
		          }
		          this.isPosting=true
		          carBasicInfo.add.bind(this)(params,(data)=>{
		            this.isPosting=false
		            this.message='申请已发送'
		            setTimeout(()=>{
		            	this.$router.push({name:'car-add'})
		            },2000)
		          },(error)=>{
		            this.message=error
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
	#add-friend-car{
		.car-id-input{
	      position:relative;
		  input{
	      	text-transform:uppercase;
	      }
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
	}
</style>