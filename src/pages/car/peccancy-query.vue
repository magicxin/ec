<template>
	<section id="peccancy-query">
		<!-- <appbar :link="{name:'index'}"> -->
		<magic-header v-if="$.env === 'native'" :headeHide="headeHide" titleName="违章查询"></magic-header>
		<!-- <content-with-loading :loaded="loaded"> -->
			<section class="input-wrapper" v-if="!queryTimesLimit">
				<mu-text-field :class="[hasFocus ? 'focus-state' : '','false-input']" label="城市" hintText="请选择城市" :errorText="selectedAddressError" :value="selectedAddress" @focus="activeAddressPicker($event)" @blur="addressIsInvalid" labelFloat fullWidth/>
				<mu-text-field ref="carIdInput" class="car-id-input" label="车牌号" hintText="请输入车牌号（如：吉AUN110）" :errorText="carIdError" v-model="carId" @focus="carIdError=''" @blur="carIdIsInvalid" labelFloat fullWidth/>
				<mu-text-field ref="carCodeInput" class="car-code-input" :label="carCodeLabel" :hintText="carCodeHintText" :errorText="carCodeError" v-model="carCode" @focus="carCodeError=''" @blur="carCodeIsInvalid" labelFloat fullWidth/>
				<mu-text-field ref="carEngineInput" class="car-engine-input" :label="carEngineLabel" :hintText="carEngineHintText" :errorText="carEngineError" v-model="carEngine" @focus="carEngineError=''" @blur="carEngineIsInvalid" labelFloat fullWidth/>			
			</section>
			<mu-popup v-if="!queryTimesLimit" position="bottom" class="popup-bottom" popupClass="popup-bottom" :open="popupOpened" @close="closePicker">
			    <mu-appbar title="选择城市">
			      <mu-flat-button slot="right" label="确定 " color="white" @click="closePicker"/>
			    </mu-appbar>
				<section class="picker-container"> 
					 <mu-picker v-if="addressSlots.length" :slots="addressSlots" :visible-item-count="5" @change="addressChange" :values="[selectedProvince,selectedCity]"/>
				</section>
			 </mu-popup>
			<mu-raised-button v-if="!queryTimesLimit" label="立即查询" class="submit" @click="submit" secondary fullWidth/>			
			<section class="query-limit" v-if="queryTimesLimit">
				<img src="../../assets/peccancy-query-empty.png" alt="no peccancies">
				<p>本周已使用询执行违章查询功能，该功能一周只能使用一次。</p>				
			</section>
		<!-- </content-with-loading> -->
		<mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>

	</section>
</template>

<script>
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	import queryAddress from 'services/peccancy-query-cities'
	import peccancyQueryInit from 'services/peccancy-query-init'
	import validate from 'utilities/validate-car-info'

	export default {
	    components: { 
	    	magicHeader,
	    	// ContentWithLoading
	    },
	    data() {
	       return {
	       		loaded:false,
	       		initProvince:'',
	       		initCity:'',
	       		selectedProvince: '',
	            selectedCity: '',
	       		selectedAddressError:'',
	            carId:'',
	            carCode:'',
	            defaultCarCode:'',
	            carEngine:'',
	            defaultCarEngine:'',
	            carIdError:'',
	            carCodeError:'',
	            carEngineError:'',  
	            address: [],         
	            addressSlots: [],
	            popupOpened:false,
	            showError:false,
	            errorMessage:'',
	            hasFocus:false,
				queryTimesLimit:false,
				headeHide:false
	        }
		},
	    computed:{
	    	selectedProvinceCode(){
	    		return this.address[this.selectedProvince].code
	    	},
	    	selectedCityCode(){
	    		return this.address[this.selectedProvince].cities[this.selectedCity].code
	    	},
	    	selectedAddress(){
	    		if(this.selectedProvince && this.selectedCity){
	    			if(this.selectedProvince == this.selectedCity){
	    				return this.selectedProvince
	    			}else{
	    				return this.selectedProvince+' '+this.selectedCity	    				
	    			}
	    		}else{
	    			return ''
	    		}
	    	},
	    	carCodeNeededLength(){
	    		if(this.selectedProvince && this.selectedCity){
	    			return this.address[this.selectedProvince].cities[this.selectedCity].carCodeNeededLength || 17	    			
	    		}else{
	    			return 17
	    		}
	    	},
	    	carEngineNeededLength(){
	    		if(this.selectedProvince && this.selectedCity){
	    			return this.address[this.selectedProvince].cities[this.selectedCity].carEngineNeededLength || 6	    			
	    		}else{
	    			return 6
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
			if(this.$.env === 'wxPublic'){
				this.headeHide =true
			}
	    	try{
	    	peccancyQueryInit.bind(this)((data)=>{
				console.log(data)
		    	let address=data.address,
		    		carInfo=data.carInfo,
		    		initProvinces=Object.keys(address),
		    		initCities=Object.keys(address[Object.keys(address)[0]].cities),
		    		localSavedData=localStorage.getItem('peccancyQuery'),
		    		parsedLocalData={}
		    	localSavedData && (parsedLocalData=JSON.parse(localSavedData))
		    	
		    	this.initProvince=parsedLocalData.provinceText || initProvinces[0]
		    	this.initCity=parsedLocalData.cityText || initCities[0]
		    	parsedLocalData.provinceText && (this.selectedProvince=this.initProvince)
		    	parsedLocalData.cityText && (this.selectedCity=this.initCity)
		    	this.address=address

				this.addressSlots=[{
	                width: '100%',
	                textAlign: 'right',
	                values: initProvinces
	            }, {
	                width: '100%',
	                textAlign: 'left',
	                values: initCities
	            }]
	            this.addressSlots[1].values = Object.keys(this.address[this.initProvince].cities)
	            this.carId=parsedLocalData.carId || carInfo.carId
	            this.carCode=parsedLocalData.carCode || carInfo.carCode
	            this.carEngine=parsedLocalData.carEngine || carInfo.carEngine
	            this.carCode && this.carCodeNeededLength && (this.carCode=this.carCode.slice(this.carCode.length-this.carCodeNeededLength))
	            this.carEngine && this.carEngineNeededLength && (this.carEngine=this.carEngine.slice(this.carEngine.length-this.carEngineNeededLength))
	            // this.carCode=carInfo.carCode.slice(carInfo.carCode.length-this.carCodeNeededLength)
	            // this.carEngine=carInfo.carEngine.slice(carInfo.carEngine.length-this.carEngineNeededLength)
	            this.loaded=true
	            // this.selectedProvince=initProvince
	            // this.selectedCity=initCity
	            setTimeout(()=>{
			    	let $$page=document.querySelector('#peccancy-query')
			         $$page.querySelector('.car-id-input input').maxLength=7
			         $$page.querySelector('.car-code-input input').maxLength=17
			         $$page.querySelector('.car-engine-input input').maxLength=20
	            },500)
	    	},(errorMessage)=>{
				// alert('errorMessage: '+ errorMessage)
				console.log(errorMessage)
	    		if(errorMessage==307){
	    			this.queryTimesLimit=true
	    			this.loaded=true
	    		}else{
		    		this.errorMessage=errorMessage
		    		this.showError=true	    			
	    		}
	    	})
	    }catch(err){
	    	alert(err)
	    }
	    },

	    methods: {
	    	addressIsInvalid(){
	    		return this.selectedAddressError=validate.addressInvalidMessage(this.selectedProvince,this.selectedCity)
	    	},
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
	    		if(!this.addressIsInvalid()){
	    			if(!this.carIdIsInvalid() && !this.carCodeIsInvalid() && !this.carEngineIsInvalid()){
	    				let query={
		    				carId:this.carId.toUpperCase(),
		    				carCode:this.carCode,
		    				carEngine:this.carEngine,
		    				province:this.selectedProvinceCode,
		    				city:this.selectedCityCode,
		    				carCodeNeededLength:this.carCodeNeededLength,
		    				carEngineNeededLength:this.carEngineNeededLength
		    			}
		    			this.$router.push({name:'peccancy-query-detail',query:query})

		    			query.provinceText=this.selectedProvince
		    			query.cityText=this.selectedCity
		    			localStorage.setItem('peccancyQuery',JSON.stringify(query))

		    		}
	    		}else{
	    			console.log('invalid input value')
	    		}
	    	},
	    	activeAddressPicker(event){
	    		event.target.blur()
	    		this.hasFocus=true
	    		this.selectedAddressError=''
	    		this.selectedProvince=this.selectedProvince || this.initProvince
	    		this.selectedCity=this.selectedCity || this.initCity
	    		this.popupOpened=true
	    	},
	    	closePicker(){
	    		this.popupOpened=false
	    		this.hasFocus=false
	    	},
	        addressChange(value, index) {
	            switch (index) {
	                case 0:
	                    this.selectedProvince = value
	                    const arr = Object.keys(this.address[value].cities)
	                    this.addressSlots[1].values = arr
	                    this.selectedCity = arr[0]
	                    break
	                case 1:
	                    this.selectedCity = value
	                    break
	            }
	            this.carCode && this.carCodeNeededLength && (this.carCode=this.carCode.slice(this.carCode.length-this.carCodeNeededLength))
	            this.carEngine && this.carEngineNeededLength && (this.carEngine=this.carEngine.slice(this.carEngine.length-this.carEngineNeededLength))

	            // if(this.carCodeError || this.carEngineError){
	            	this.carCodeIsInvalid()
	            	this.carEngineIsInvalid()
	            // }
	        }
	    }
	}
</script>

<style lang="scss">
 @import "../../scss/variables.scss";
	#peccancy-query{
	.appbar i.mu-icon{
		background-size:80%;
		color:transparent;
	}

		.query-limit{
			img{
				width:55%;
				display:block;
				margin:$spaceBig auto 0;
				position:relative;
				left:-1rem;
			}
			p{
				text-align:center;
				margin-top:-$spaceSmall;
			}
		}
		.car-id-input input{
			text-transform:uppercase;
		}
		.input-wrapper{
			padding-top:$spaceMedium;
			// .mu-text-field{
			// 	padding:0 $spaceSmall;
			// 	&.has-label .mu-text-field-label.float{
			// 		color:$colorDark;
			// 	}
			// 	&.focus-state{
			// 		color:$colorSecondary;
			// 	}
			// 	.mu-text-field-help{
			// 		padding:0 $spaceSmall;
			// 	}
			// 	.mu-text-field-focus-line{
			// 		background-color:$colorSecondary;
			// 	}
				
			// }
			.mu-text-field.false-input.focus-state .mu-text-field-focus-line{
					transform:scaleX(1);
			}
		}

		.submit{
			display:block;
			max-width:$fullSize;
			margin:0 auto;
			margin-top:$spaceBig;
			// &.mu-raised-button-secondary{
			// 	background-color:$colorSecondary;
			// }
		}

	}
</style>

