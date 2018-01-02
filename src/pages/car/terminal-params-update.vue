<template>
	<section id="terminal-params-update">
   	 <!-- <appbar :link="{name:'car-test'}"/> -->
	 <magic-header titleName="参数编辑"></magic-header>
   	 <!-- <content-with-loading :loaded="loaded"> -->
	   	 		<mu-text-field label="卡号" type="number" hintText="请输入最大12位非0开始的数字卡号" :errorText="cardNumberError" v-model="cardNumber" @focus="cardNumberError=''" @blur="cardNumberIsInvalid" labelFloat fullWidth/>
				<!-- <mu-text-field label="编号" type="number" hintText="请输入6位数字编号" :errorText="cardIndexError" v-model="cardIndex" @focus="cardIndexError=''" @blur="cardIndexIsInvalid" labelFloat fullWidth/> -->
				<mu-text-field label="IP" type="text" hintText="请输入IP，如192.168.1.1" :errorText="ipError" v-model="ip" @focus="ipError=''" @blur="ipIsInvalid" labelFloat fullWidth/>
				<mu-text-field label="端口号" type="number" hintText="请输入端口号，如8080" :errorText="portError" v-model="port" @focus="portError=''" @blur="portIsInvalid" labelFloat fullWidth/>
				<false-input label="设备类型" :focused="terminalTypeFocused" :value="terminalTypeText" placeholder="请选择终端类型" :errorText="terminalTypeError" @focus="terminalTypeFocused=true"/>
				<mu-text-field label="车牌号" hintText="请输入车牌号，如吉AUN110" :errorText="carBrandError" v-model="carBrand" @focus="carBrandError=''" @blur="carBrandIsInvalid" labelFloat fullWidth/>
				<mu-raised-button label="开始写入" class="submit" @click="submitInfo" secondary fullWidth/>			

					<mu-popup position="bottom" popupClass="popup-bottom terminal-type-select" :open="terminalTypeFocused && $route.name=='terminal-params-update'" @close="closeTerminalTypeSelect">
						<mu-appbar title="选择终端类型">
						    <mu-flat-button slot="right" label="确定" color="white" @click="closeTerminalTypeSelect"/>
						</mu-appbar>
						<template v-for="terminalType in terminalTypes">
							<mu-list-item @click="selectTerminalType(terminalType)">
							{{terminalType.text}}
							<mu-checkbox label="" :value="terminalType.selected" slot="right"/>
							</mu-list-item>
							<mu-divider/>
						</template>
					</mu-popup>
   	 <!-- </content-with-loading>  -->
   	 <loading-spin v-if="submitingInfo" :fixed="true">
   	 	正在写入，请稍后 ...
   	 </loading-spin>
	<mu-snackbar class="center" v-if="!!message" :message="message" action="我知道了" @actionClick="message=''" @close="message=''"/>
	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	import FalseInput from 'components/false-input'
	import LoadingSpin from 'components/loading-spin'
	// import MuTextField from 'muse-components/textField'
	// import MuPopup from 'muse-components/popup'
	// import MuAppbar from 'muse-components/appbar'
  	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  	// import MuSnackbar from 'muse-components/snackbar'
  	// import MuCheckbox from 'muse-components/checkbox'
  	// import MuFlatButton from 'muse-components/flatButton'
  	// import MuDivider from 'muse-components/divider'
  	// import MuRaisedButton from 'muse-components/raisedButton'
  	import carInvalidMessage from 'utilities/validate-car-info'
  	import terminalParamsData from 'services/terminal-params-data'
	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			FalseInput,
			// MuTextField,
			// MuPopup,
			// MuAppbar,
			// MuList,
			// MuListItem,
			// MuCheckbox,
			// MuFlatButton,
			// MuDivider,
			// MuRaisedButton,
			LoadingSpin,
			// MuSnackbar
		},
		data(){
			return {
				loaded:false,
				submitingInfo:false,
				// showInfoForm:true,
				cardNumber:'',
				cardNumberError:'',
				cardIndex:'',
				cardIndexError:'',
				ip:'',
				ipError:'',
				port:'',
				portError:'',
				terminalType:'',
				terminalTypeText:'',
				terminalTypeError:'',
				terminalTypeFocused:false,
				carBrand:'',
				carBrandError:'',
				terminalTypes:[],
				message:''
			}
		},
		created(){
			this.initData()
		},
		watch:{
			'$route':function(to,from){
				if(to.name=='terminal-params-update'){
					this.initData()
				}
			}
		},
		methods:{
			initData(){
				this.loaded=false
				this.submitingInfo=false
				this.terminalTypeFocused=false
				this.cardNumber=''
				this.cardNumberError=''
				this.cardIndex=''
				this.cardIndexError=''
				this.ip=''
				this.ipError=''
				this.port=''
				this.portError=''
				this.terminalType=''
				this.terminalTypeText=''
				this.terminalTypeError=''
				this.carBrand=''
				this.carBrandError=''
				this.terminalTypes=[]
				this.message=''
				terminalParamsData.get({},(data,message,resultCode)=>{
					this.cardNumber=data.cardNumber
					this.cardIndex=data.cardIndex
					this.ip=data.ip 
					this.port=data.port
					this.terminalType=data.terminalType
					this.terminalTypeText=data.terminalTypeText
					this.carBrand=data.carBrand
					this.terminalTypes=data.terminalTypes
					this.message=message
					this.loaded=true
				},(err)=>{
					this.message=err
					this.loaded=true
				})
			},
			cardNumberIsInvalid(){
				if(!this.cardNumber || this.cardNumber.toString().length>12 || !this.cardNumber.toString().match(/\d*/)[0]){
					return this.cardNumberError='请输入最大12位非0开始的数字卡号'
				}

				// if(!this.cardNumber || !this.cardNumber.toString().match(/^[0-9]{12}$/)){
				// 	return this.cardNumberError='请输入12位数字卡号'					
				// }

				return this.cardNumberError=''
			},
			cardIndexIsInvalid(){
				// if(!this.cardIndex || !this.cardIndex.toString().match(/^[0-9]{6}$/)){
				// 	return this.cardIndexError='请输入6位数字编号'					
				// }
				return this.cardIndexError=''
			},
			ipIsInvalid(){
				if(!this.ip || !this.ip.toString().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)){
					return this.ipError='请输入正确的ip地址'					
				}
				return this.ipError=''
			},
			portIsInvalid(){
				if(!this.port || !this.port.toString().match(/^\d{1,5}$/)){
					return this.portError='请输入正确的端口号'					
				}
				return this.portError=''
			},
			terminalTypeIsInvalid(){
				if(!this.terminalType){
					return this.terminalTypeError='请选择终端类型'
				}
				return this.terminalTypeError=''
			},
			carBrandIsInvalid(){
				return this.carBrandError=carInvalidMessage.carIdInvalidMessage(this.carBrand)
			},
			selectTerminalType(terminal){
				this.terminalTypes.forEach((terminalItem)=>{
					terminalItem.selected=false
				})
				terminal.selected=true
				this.terminalType=terminal.type
				this.terminalTypeText=terminal.text
			},
			closeTerminalTypeSelect(){
				this.terminalTypeFocused=false
				this.terminalTypeIsInvalid()
			},
			submitInfo(){
				if(!this.cardNumberIsInvalid() && !this.cardIndexIsInvalid() && !this.ipIsInvalid() && !this.portIsInvalid() && !this.terminalTypeIsInvalid() && !this.carBrandIsInvalid()){
					this.submitingInfo=true
					terminalParamsData.post({
						cardNumber:(()=>{
							let makedNumber=this.cardNumber.toString().trim()
							if(makedNumber.length<12){
								let addLength=12-makedNumber.length
								while(addLength>0){
									makedNumber='0'+makedNumber
									addLength--
								}
							}
							console.log(makedNumber)
							return makedNumber
						})(),
						// cardIndex:this.cardIndex,
						ip:this.ip,
						port:this.port,
						terminalType:this.terminalType,
						carBrand:this.carBrand
					},()=>{
						this.submitingInfo=false
						this.message='写入成功'
					},(err)=>{
						this.submitingInfo=false
						this.message=err
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../scss/variables.scss";
	#terminal-params-update{
		.submit{
			margin-top:2rem;
		}
	}
				.terminal-type-select .mu-checkbox{
				pointer-events:none;
				input[type="checkbox"]:checked + .mu-checkbox-wrapper .mu-checkbox-ripple-wrapper,
				input[type="checkbox"]:checked + .mu-checkbox-wrapper .mu-checkbox-icon-uncheck,
				.mu-checkbox-icon-checked{
					color:$colorSecondary;
				}
			}
</style>